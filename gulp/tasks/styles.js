import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleancss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import groupcssmedia from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

export const styles = () => app.gulp.src(app.path.src.styles, { sourcemaps: app.isDev })
  .pipe(app.plugins.plumber(app.plugins.notify.onError({
    title: "SASS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(app.plugins.if(app.isBuild, groupcssmedia()))
  .pipe(app.plugins.if(app.isBuild, webpcss({
    webpClass: '.webp',
    noWebpClass: '.no-webp'
  })))
  .pipe(app.plugins.if(app.isBuild, autoprefixer({
    grid: true,
    overrideBrowserlist: ['last 4 version'],
    cascade: true
  })))
  .pipe(app.plugins.if(app.isBuild, cleancss()))
  .pipe(rename({
    basename: 'main',
    suffix: '.min',
  }))
  .pipe(app.plugins.replace(/@img\//g, '../img/'))
  .pipe(app.gulp.dest(app.path.dest.styles))
  .pipe(app.plugins.browsersync.stream());