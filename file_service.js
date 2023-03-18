class TriggerService {
  constructor(closure_name) {
    this.LIB_NAME = 'Tradesupport';
    this.closure_name = closure_name;
  }

  setTrigger(json) {
    PropertiesService.getUserProperties().setProperty('callTrigger', json);
    ScriptApp.newTrigger('callTrigger').timeBased().after(30*1000).create();
  }

  getPropsJson(hash) {
    return JSON.stringify({...hash, lib_name: this.LIB_NAME, closure_name: this.closure_name});
  }

  getProps() {
    return JSON.parse(PropertiesService.getUserProperties().getProperty('callTrigger'));
  }

  deleteProps() {
    PropertiesService.getUserProperties().deleteProperty('callTrigger');
  }

  execute() {
    console.log('executing... : ' + this.closure_name);
  }
}

class GeneratePicsService extends TriggerService {
  constructor() {
    super('generatePics');
  }

  setTrigger(url_drive_id, presentation_id, next_slide_no) {
    super.setTrigger(this.getPropsJson(url_drive_id, presentation_id, next_slide_no));
  }

  getPropsJson(url_drive_id, presentation_id, next_slide_no) {
    return super.getPropsJson({
      url_drive_id: url_drive_id,
      presentation_id: presentation_id,
      next_slide_no, next_slide_no,
    });
  }

  execute() {
    super.execute();
    const props = super.getProps();
    
    const folder = DriveApp.getFolderById(props['url_drive_id']);
    const presentation = SlidesApp.openById(props['presentation_id']);
    const fileName       = presentation.getName();
    const slides = presentation.getSlides();

    const createPic = (pageId, pageNo) => {
      const url = "https://docs.google.com/presentation/d/" + props['presentation_id'] + "/export/png" 
        + "?id=" + props['presentation_id'] + "&pageid=" + pageId;
      const options = {
        method: "get",
        headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
        muteHttpExceptions: true
      };

      const responce = UrlFetchApp.fetch(url, options);
      if(responce.getResponseCode() === 200) {
        return folder.createFile(responce.getBlob()).setName(fileName + '_' + pageNo + ".png");
      }
    };
    const IMAGE_NUM = 15;
    let pageNo = parseInt(props['next_slide_no']);
    slides.slice(props['next_slide_no'], IMAGE_NUM + props['next_slide_no']).forEach((slide) => {
      createPic(slide.getObjectId(), pageNo);
      pageNo ++;
    });

    if(slides.slice(props['next_slide_no']).length > IMAGE_NUM) {
      this.setTrigger(props['url_drive_id'], props['presentation_id'], IMAGE_NUM + props['next_slide_no']);
    } else {
      console.log('GeneratePicsService is end');
    }
  }
}

class AllocateAllPicsService extends TriggerService {
  constructor() {
    super('allocateAllPics');
  }

  setTrigger(url_drive_id, file_no, presentation_id) {
    super.setTrigger(this.getPropsJson(url_drive_id, file_no, presentation_id));
  }

  getPropsJson(url_drive_id, file_no, presentation_id) {
    return super.getPropsJson({
      url_drive_id: url_drive_id,
      presentation_id: presentation_id,
      file_no: file_no,
    });
  }

  execute() {
    super.execute();
    const props = super.getProps();
    const parentFolder = DriveApp.getFolderById(props['url_drive_id']);
    const folder = parentFolder.getFoldersByName(FileUtil.getDividedFolderName(props['file_no'])).next();
    const files = folder.getFiles();
    const sorted = FileUtil.sortFiles(files);

    const presentation = SlidesApp.openById(props['presentation_id']);
    console.log('AllocateAllPicsService folder: ' + folder.getName());

    let pagePicsNum = 0;
    let slidePointer = presentation.getSlides().slice(-1)[0];
    sorted.forEach(fp => {
      pagePicsNum++;

      slidePointer.insertImage(fp.file.getBlob());
      if (pagePicsNum === 6) {
        const number = fp.file.getName().slice(7, 12)
        const allocation = new Allocation(slidePointer);
        allocation.allocatePics(presentation.getSlides().length, number, folder.getName());
        slidePointer = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
        pagePicsNum = 0;
      }
    });

    const next_file_no = parseInt(props['file_no']) + 1;
    if(parentFolder.getFoldersByName(FileUtil.getDividedFolderName(next_file_no)).hasNext()) {
      this.setTrigger(props['url_drive_id'], next_file_no, props['presentation_id']);
    } else {
      console.log('AllocateAllPicsService is end');
    }
  }
}

class OrganizeFolderService extends TriggerService {
  constructor() {
    super('organizeFolder');
  }

  setTrigger(url_drive_id, file_no, presentation_id) {
    super.setTrigger(this.getPropsJson(url_drive_id, file_no, presentation_id));
  }

  getPropsJson(url_drive_id, file_no, presentation_id) {
    return super.getPropsJson({
      url_drive_id: url_drive_id,
      presentation_id: presentation_id,
      file_no: file_no,
    });
  }

  execute() {
    super.execute();
    const props = super.getProps();
    const folder = DriveApp.getFolderById(props['url_drive_id']);
    const files = FileUtil.sortFiles(folder.getFiles());
    let file_no = parseInt(props['file_no']);
    let child = null;
    const DIVID_FILES_NUM = 30;
    const MAX_FILE_NUM = 6 * DIVID_FILES_NUM;
    

    files.slice(0, MAX_FILE_NUM).forEach(fp => {
      if (file_no % DIVID_FILES_NUM === 0) {
        child = folder.createFolder(FileUtil.getDividedFolderName(file_no / DIVID_FILES_NUM));
      }

      fp.file.moveTo(child);
      file_no++;
    });

    super.deleteProps();
    if(files.length > MAX_FILE_NUM) {
      this.setTrigger(props['url_drive_id'], file_no, props['presentation_id']);
    } else {
      const presentation = SlidesApp.openById(props['presentation_id']);
      const service = new AllocateAllPicsService('allocateAllPics');
      service.setTrigger(props['url_drive_id'], 0, presentation.getId());
      console.log('OrganizeFolderService is end');
    }
  }
}

class FileUtil {
  static sortFiles(files) {
    let sorted = [];
    while (files.hasNext()) {
      let file = files.next();
      if (!file.getMimeType().match(/image/)) {
        continue;
      }
      const number = file.getName().slice(7, 12)
      sorted.push({id: number, file: file});
    }

    sorted.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }

      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });

    return sorted;
  }

  static getDividedFolderName(file_no){
    return 'divided_' + String(file_no);
  }
}