const { srcDir, destDir, releaseDir } = require('../config.json');
const capitalize = require('capitalize');
const Manifest = require('./Manifest');
const { limpiarRuta, getManisfestFiles, getManisfestFolders, getManifestLanguages } = require("./utils");
const { task, src, dest, series } = require('gulp');
const gulpClean = require('gulp-clean');
const gulpForeach = require('gulp-foreach');
const GulpZip = require('gulp-zip');

class Component {

    constructor(nombre) {
        let ruta = limpiarRuta(srcDir)
        this.rutaDesde = ruta;
        nombre = nombre.toLowerCase();
        this.nombre = nombre;
        this.cNombre = capitalize(nombre);
        this.rutaCompletaSiteDesde = `${ruta}components/com_${nombre}/`;
        this.rutaCompletaAdminDesde = `${ruta}administrator/components/com_${nombre}/`;
        this.rutaMediaDesde = `${ruta}media/com_${nombre}/`
        this.rutaLanguageSiteDesde = `${ruta}language/`;
        this.rutaLanguageAdminDesde = `${ruta}administrator/language/`;

        let manifest = new Manifest(ruta, 'component', nombre);
        this.manifiesto = manifest.manifiesto;
        this.version = this.manifiesto.version

        this.copyComponent = [];

        let destino = destDir.charAt(destDir.length - 1) == '/' ? destDir : destDir + '/';
        this.destino = destino + 'components/' + this.nombre + '/';

        if (this.manifiesto.files[0] !== undefined) {
            this.siteDestino = this.destino + this.manifiesto.files[0].$.folder + '/';
        }

        if (this.manifiesto.languages[0] !== undefined) {
            let folder = this.manifiesto.languages[0].$.folder;
            let dest = this.manifiesto.languages[0].language[0]['_'].split('/')[0];
            this.siteLanguageDestino = this.destino + folder + '/';
        }

        if (this.manifiesto.administration[0].files[0] !== undefined) {
            this.adminDestino = this.destino + this.manifiesto.administration[0].files[0].$.folder;
        }

        if (this.manifiesto.administration[0].languages[0] !== undefined) {
            let folder = this.manifiesto.administration[0].languages[0].$.folder;
            let dest = this.manifiesto.administration[0].languages[0].language[0]['_'].split('/')[0];
            this.adminLanguageDestino = this.destino + folder + '/' + dest + '/';
        }

        if (this.manifiesto.media[0] !== undefined) {
            let folder = this.manifiesto.media[0].$.folder;
            this.mediaDestino = this.destino + folder + '/';
        }

        let destinoRelease = releaseDir.charAt(releaseDir.length - 1) == '/' ? releaseDir : releaseDir + '/';
        this.releaseDest = destinoRelease + 'components/' + this.nombre + '/';

        this.srcSitePathArrayLong = this.rutaCompletaSiteDesde.replace(/^\/+|\/+$/g, '').split('/').length;
        this.srcAdminPathArrayLong = this.rutaCompletaAdminDesde.replace(/^\/+|\/+$/g, '').split('/').length;
        this.srcMediaPathArrayLong = this.rutaMediaDesde.replace(/^\/+|\/+$/g, '').split('/').length;
    }

    // getters
    // site files
    get siteFiles() {
        return getManisfestFiles(this.manifiesto.files, this.rutaCompletaSiteDesde);
    }
    // site folders
    get siteFolders() {
        return getManisfestFolders(this.manifiesto.files, this.rutaCompletaSiteDesde);
    }
    // site languages files
    get siteLanguages() {
        return getManifestLanguages(this.manifiesto.languages, this.rutaLanguageSiteDesde);
    }
    // media files
    get mediaFiles() {
        return getManisfestFiles(this.manifiesto.media, this.rutaMediaDesde);
    }
    // media folders
    get mediaFolders() {
        return getManisfestFolders(this.manifiesto.media, this.rutaMediaDesde);
    }
    // administrator files
    get adminFiles() {
        return getManisfestFiles(this.manifiesto.administration[0].files, this.rutaCompletaAdminDesde);
    }
    // administrator folders
    get adminFolders() {
        return getManisfestFolders(this.manifiesto.administration[0].files, this.rutaCompletaAdminDesde)
    }
    // administrator languages files
    get adminLanguages() {
        return getManifestLanguages(this.manifiesto.administration[0].languages, this.rutaLanguageAdminDesde);
    }
    // manifest file
    get manifestFile() {
        return this.rutaCompletaAdminDesde + this.nombre + '.xml';
    }

    get zipFileName() {
        return `com_${this.nombre}.v${this.version}.zip`;
    }

    // clean Task
    get cleanTask() {
        let destino = this.destino;

        task(`cleanComponent${this.cNombre}`, function () {
            return src(destino, { read:false, allowEmpty:true })
            .pipe(gulpClean({ force:true }))
        })

        return `cleanComponent${this.cNombre}`;
    }

    // copy Task
    get copyTask() {
        this.copySiteFilesTask;
        this.copySiteFoldersTask;
        this.copySiteLanguagesTask;
        this.copyMediaFilesTask;
        this.copyMediaFoldersTask;
        this.copyAdminFilesTask;
        this.copyAdminFoldersTask;
        this.copyAdminLanguagesTask;
        this.copyManifestFile;

        task(`copyComponent${this.cNombre}`, series(...this.copyComponent));

        return `copyComponent${this.cNombre}`;
    }

    // release Task
    get releaseTask() {
        let desde = this.destino + '/**';
        let destino = this.releaseDest;
        let filename = this.zipFileName;

        task(`releaseComponent${this.cNombre}`, function(cb) {
            return src(desde)
                .pipe(GulpZip(filename))
                .pipe(dest(destino))
        })

        return `releaseComponent${this.cNombre}`;        
    }

    // copy site files task
    get copySiteFilesTask() {
        let files = this.siteFiles;
        
        if (files.length > 0) {
            let destino = this.siteDestino;
            task(`copyComponentSiteFiles${this.cNombre}`, function() {
                return src(files, { allowEmpty: true })
                .pipe(dest(destino))
            })

            this.copyComponent.push(`copyComponentSiteFiles${this.cNombre}`);
        }
    }
    // copy site folders task
    get copySiteFoldersTask() {
        let folders = this.siteFolders;
        
        if (folders.length > 0) {
            let destino = this.siteDestino;
            let long = this.srcSitePathArrayLong;

            task(`copyComponentSiteFolders${this.cNombre}`, function() {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destFolderName = file.path.replace(/^\/+|\/+$/g, '').split('/')[long];
                    let destinoF = `${destino}${destFolderName}/`;
                    return stream
                    .pipe(dest(destinoF))
                }))
            })

            this.copyComponent.push(`copyComponentSiteFolders${this.cNombre}`);
        }
    }
    // copy site languages task
    get copySiteLanguagesTask() {
        let languages = this.siteLanguages;

        if (languages.length > 0) {
            let destino = this.siteLanguageDestino;

            task(`copyComponentSiteLanguages${this.cNombre}`, function () {
                return src(languages, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let pathArray = file.path.split('/');
                    let longPathArray = pathArray.length;
                    let lang = pathArray[longPathArray - 2];
                    return stream
                    .pipe(dest(destino + lang + '/'))
                }))
            })

            this.copyComponent.push(`copyComponentSiteLanguages${this.cNombre}`);
        }
    }
    // copy media files task
    get copyMediaFilesTask() {
        let files = this.mediaFiles;
        
        if (files.length > 0) {
            let destino = this.mediaDestino;
            task(`copyComponentMediaFiles${this.cNombre}`, function() {
                return src(files, { allowEmpty: true })
                .pipe(dest(destino))
            })

            this.copyComponent.push(`copyComponentMediaFiles${this.cNombre}`);
        }
    }
    // copy media folders task
    get copyMediaFoldersTask() {
        let folders = this.mediaFolders;
        
        if (folders.length > 0) {
            let destino = this.mediaDestino;
            let long = this.srcMediaPathArrayLong;

            task(`copyComponentMediaFolders${this.cNombre}`, function() {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destFolderName = file.path.replace(/^\/+|\/+$/g, '').split('/')[long];
                    let destinoF = `${destino}${destFolderName}/`;
                    return stream
                    .pipe(dest(destinoF))
                }))
            })

            this.copyComponent.push(`copyComponentMediaFolders${this.cNombre}`);
        }
    }
    // copy admin files task
    get copyAdminFilesTask() {
        let files = this.adminFiles;
        
        if (files.length > 0) {
            let destino = this.adminDestino;
            task(`copyComponentAdminFiles${this.cNombre}`, function() {
                return src(files, { allowEmpty: true })
                .pipe(dest(destino))
            })

            this.copyComponent.push(`copyComponentAdminFiles${this.cNombre}`);
        }
    }
    // copy admin folders task
    get copyAdminFoldersTask() {
        let folders = this.adminFolders;
        
        if (folders.length > 0) {
            let destino = this.adminDestino;
            let long = this.srcAdminPathArrayLong;

            task(`copyComponentAdminFolders${this.cNombre}`, function() {
                return src(folders, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let destFolderName = file.path.replace(/^\/+|\/+$/g, '').split('/')[long];
                    let destinoF = `${destino}${destFolderName}/`;
                    return stream
                    .pipe(dest(destinoF))
                }))
            })

            this.copyComponent.push(`copyComponentAdminFolders${this.cNombre}`);
        }
    }    
    // copy admin languages task
    get copyAdminLanguagesTask() {
        let languages = this.adminLanguages;

        if (languages.length > 0) {
            let destino = this.adminLanguageDestino;

            task(`copyComponentAdminLanguages${this.cNombre}`, function () {
                return src(languages, { allowEmpty: true })
                .pipe(gulpForeach(function (stream, file) {
                    let pathArray = file.path.split('/');
                    let longPathArray = pathArray.length;
                    let lang = pathArray[longPathArray - 2];
                    return stream
                    .pipe(dest(destino + lang + '/'))
                }))
            })

            this.copyComponent.push(`copyComponentAdminLanguages${this.cNombre}`);
        }
    }
    get copyManifestFile() {
        let destino = this.destino
        let manifest = this.manifestFile;

        task(`copyManifestFile${this.cNombre}`, function () {
            return src(manifest, { allowEmpty: true })
            .pipe(dest(destino))
        })
        this.copyComponent.push(`copyManifestFile${this.cNombre}`);
    }
}

module.exports = Component;