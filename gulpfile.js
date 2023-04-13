import gulp from 'gulp';

import { path } from './gulp/config/path.js';
import { images } from './gulp/tasks/images.js';
import { clean } from './gulp/tasks/clean.js';
import { html } from './gulp/tasks/html.js';
import { plugins } from './gulp/config/plugins.js';
import { scripts } from './gulp/tasks/scripts.js';
import { styles } from './gulp/tasks/styles.js';
import { server } from './gulp/tasks/server.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { svgSprite } from './gulp/tasks/svgsprite.js';
import { zip } from './gulp/tasks/zip.js';

const isBuild = process.argv.includes('--production')
const isDev = !isBuild;

global.app = {
  isBuild: isBuild,
  isDev: isDev,
  gulp: gulp,
  path: path,
  plugins: plugins,
}

export { svgSprite, clean };

export const watch = () => {
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.styles, styles);
  gulp.watch(path.watch.scripts, scripts);
  gulp.watch(path.watch.html, html);
}

export const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

export const build = gulp.series(clean, fonts, svgSprite, gulp.parallel(html, images, styles, scripts));
export const deployZIP = gulp.series(build, zip);
export const dev = gulp.series(build, server, watch);

export default isBuild ? build : dev;