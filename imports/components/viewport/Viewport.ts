import { Session } from 'meteor/session'

import { getPageDocumentIDs } from '/both/api/methods/training-module-documents.js';
import { getPageDocuments } from '/both/api/methods/training-module-documents.js';

import { getPageMonitoringNote } from '/both/api/methods/training-module-monitoring-notes.js';

import { getPageDocumentNNoteData } from '/both/api/methods/training-module-documents.js';
import { getPreviousPageData } from '/both/api/methods/training-module-pages.js';

import { CMethodHelper } from '/both/helpers/CMethodHelper';


class Viewport {

    __moduleId: string;
    __pageId: string;
    __prevPageId: string;
    __nextPageId: string;
    __userId: string;
    __pageDocumentIDs: Array<string>;

    constructor(moduleId: string, pageId: string, userId: string, pageDocumentIDs: Array<string>) {
        this.__moduleId = moduleId;
        this.__pageId = pageId;
        this.__userId = userId;
        this.__pageDocumentIDs = pageDocumentIDs;

        Session.set("Module.PageDocuments", null)
        Session.set("Module.PageNotes", null); 
        Session.set("Module.page.note.submitted", false);
    }

    // getPageDocumentIDs(callback: (methodResponse: object) => void): object {

    //     let _obj = {
    //         moduleId: this.__moduleId,
    //         pageId: this.__pageId
    //     }

    //     new CMethodHelper.getMethod(getPageDocumentIDs, _obj).call((res) => {
    //         callback(res)
    //     })
    //     return this;
    // }

    getPageDocuments(callback?: (methodResponse: object) => void): object {
        try {

            let _obj = {
                pageDocumentIDs: this.__pageDocumentIDs
            }

            new CMethodHelper().getMethod(getPageDocuments, _obj).call((res) => {      	
                // console.log(res)
                if(callback) callback(res);
                // return res;
            });

        }
        catch(ex) {
            console.log("Error")
            throw new Error(ex)
        }

        return this;        
    }

    getPageMonitoringNotes(callback?: (methodResponse: object) => void): object {

        try {

            let _obj = {
                moduleId: this.__moduleId,
                pageId: this.__pageId,
                userId: this.__userId                
            }

            new CMethodHelper().getMethod(_obj).call((res) => {      	
                // console.log(res)
                if(callback) callback(res);
                // return res;
            });

        }
        catch(ex) {
            console.log("Error")
            throw new Error(ex)
        }        

        return this;
    }

    getPageDocumentNNoteData(callback?: (methodResponse: object) => void): object {
        try {

            let _pageDocNNoteObj = {
                moduleId: this.__moduleId,
                pageId: this.__pageId,
                userId: this.__userId,
                pageDocumentIDs: this.__pageDocumentIDs
            }

            // console.log(_pageDocNNoteObj);

            new CMethodHelper().getMethod(getPageDocumentNNoteData, _pageDocNNoteObj).call((res) => {      	
                // console.log(res)
                if(res && res.pageDocuments && res.pageDocuments.length > 0) {
                    Session.set("Module.PageDocuments", res.pageDocuments)
                }
                if(res && res.pageNotes) {
                    Session.set("Module.PageNotes", res.pageNotes);                            
                    $('#txta_user_input').val(res.pageNotes.note)                                      
                }

                if(callback) callback(res);
                // return res;
            });

        }
        catch(ex) {
            console.log("Error")
            throw new Error(ex)
        }

        return this;
    }

    getPreviousPageData(pageId: string, callback?: (methodResponse: object) => void): object { //-- Viewport page id from Viewport Answer page

        try {

            let _obj = {
                pageId: pageId || this.__pageId                
            }

            new CMethodHelper().getMethod(getPreviousPageData, _obj).call((res) => {      	
                // console.log(res)
                if(res && res._id) {
                    this.__prevPageId = res._id;
                    this.__pageId = res._id;
                }
                // console.log(this.__pageId)
                if(callback) callback(res);
            });

        }
        catch(ex) {
            console.log("Error")
            throw new Error(ex)
        }
        
        return this;
    }

    getNextPageData(): object { //-- Viewport answer page from Viewport page

        return this;
    }

}

export default Viewport;
