import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import ttf2woff from 'gulp-ttf2woff';

export const otfToTtf = () => app.gulp.src(`${app.path.src.fonts}*.otf`)
  .pipe(app.plugins.plumber(app.plugins.notify.onError({
    title: 'FONTS',
    message: 'Error: <%= error.message %>'
  })))
  .pipe(fonter({
    formats: ['ttf'],
  }))
  .pipe(app.gulp.dest(`${app.path.src.fonts}`));

export const ttfToWoff = () => app.gulp.src(app.path.src.fonts)
  .pipe(app.plugins.plumber(app.plugins.notify.onError({
    title: 'FONTS',
    message: 'Error: <%= error.message %>'
  })))
  .pipe(ttf2woff())
  .pipe(app.gulp.dest(app.path.dest.fonts))
  .pipe(app.gulp.src(app.path.src.fonts))
  .pipe(ttf2woff2())
  .pipe(app.gulp.dest(app.path.dest.fonts));

export const fontsStyle = async () => {
  const cb = () => {};
  const fontsFile = `${app.path.srcFolder}/styles/includes/_fonts.sass`;
  fs.readdir(app.path.dest.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        fontsFiles.forEach(fontFile => {
          const fontFileName = fontFile.split('.')[0];
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            const fontStyle = fontWeight.toLowerCase().includes('italic') ? 'italic' : 'normal';
            switch (fontWeight.toLowerCase()) {
              case 'thin': fontWeight = 100; break;
              case 'extralight': fontWeight = 200; break;
              case 'light': fontWeight = 300; break;
              case 'medium': fontWeight = 500; break;
              case 'semibold': fontWeight = 600; break;
              case 'bold': fontWeight = 700; break;
              case 'extrabold': fontWeight = 800; break;
              case 'black': fontWeight = 900; break;
              default: fontWeight = 400;
            }
            const str =
              "@font-face\n\tfont-family: ".concat(fontName,
                "\n\tfont-display: swap\n\tsrc: url('../font/", fontFileName,
                ".woff2') format('woff2'), url('../font/", fontFileName,
                ".woff') format('woff')\n\tfont-weight: ", fontWeight,
                "\n\tfont-style: ", fontStyle,
                "\n\r\n"
              );
            fs.appendFile(fontsFile, str, cb);
            newFileOnly = fontFileName;
          }
        });
      } else {
        console.log('file styles/includes/_fonts.sass already exist...');
      }
    }
  });
  return app.gulp.dest(`${app.path.srcFolder}`);
};