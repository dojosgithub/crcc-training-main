
export class CUtil {
    public generateStyleLink(path: string, file: string, ext: string = '.css'): this {

        if(file) { //-- path can be null if the css file is in the root folder of /imports/ui/stylesheets (eg. 404.css)          
            let _styleLink = document.createElement('link');

            _styleLink.setAttribute('rel', 'stylesheet');
            _styleLink.setAttribute('type', 'text/css');
            _styleLink.setAttribute('href', path+'/'+file+ext);

            document.head.appendChild(_styleLink);            
        }

        return this;
    }
}
