This is my REST API for file managment. All uploaded files are stored in AWS S3Bucket. Server provide only URL to this files.

On

>GET api/filesystem

will return list of files and folders. You can choose fodler by adding 'folder' key and folder name value to request body.

>GET api/filesystem/:filename

will return URL of filename. If the file you want to get is located in the folder, you need to set folder name or path to folder in request body by adding 'folder' key and folder name/path as a value.

>POST /api/filesystem

will upload file to S3Bucket. Maximum file size is 10 MB. You can save file into a folder by setting folder name/path in request body by adding 'folder' key and folder name/path as a value. It will create new folder if there already no folder with such name.

>DEl /api/filesystem/:filename

will delete file with this name in S3Bucket. If file, which you want to delete is located in folder, add folder name/path in request body with key 'folder' and folder name/path as value.

>DEL /api/filesystem

will delete folder and all files in it. require folder name/path in request body with 'folder' as key and folder name/path as value