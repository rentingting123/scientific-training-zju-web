import cdn from "@/components/JxFileUpload/spaceNotice"
class MyUploadAdapter {
    constructor( loader ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => cdn.upload({file:file,fileType:2}).then(data=>{
                return {
                    default:data.location
                }
            }) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }
}
function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    };
}
export default MyCustomUploadAdapterPlugin