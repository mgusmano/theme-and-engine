global["chalk"]  = require('chalk');
global["rimraf"] = require("rimraf");
global["mkdirp"] = require("mkdirp");
global["fs"]  = require("fs-extra");

var toolkit = process.argv[2];
go()

async function go() {
  var appFolder = `./${toolkit}`
  var outputFolder = `${appFolder}/ext-${toolkit}-runtime`

  console.log(`${chalk.green("Step 1:")} sencha app build in ${appFolder}`)
  await _executeAsync('sencha', ['app','build','development'], `${appFolder}`, {child: null});

  var inputFile = `${outputFolder}/${toolkit}.engine.enterprise.uncompressed.js`
  var outputFile = `${outputFolder}/${toolkit}.engine.enterprise.js`
  console.log(`${chalk.green("Step 2:")} uglify ${inputFile}`)
  var uglify = require("uglify-js");
  var ugly = uglify.minify({"ext": fs.readFileSync(`${inputFile}`, "utf8")})

  console.log(`${chalk.green("Step 3:")} write uglify to ${outputFile}`)
  fs.writeFileSync(outputFile, ugly.code);

  console.log(`${chalk.green("Step 3:")} delete ${inputFile}`)
  rimraf.sync(`${inputFile}`);

  var css1File = `${outputFolder}/material/material-all_1.css`
  console.log(`${chalk.green("Step 4:")} clean up ${css1File}`)
  var css1FileData = fs.readFileSync(`${css1File}`, "utf8")
  var css1FileData2 = css1FileData.replace(/display:box/g, 'display:flex');
  var css1FileDataFinal = css1FileData2.replace(/:start/g, ':flex-start');
  fs.writeFileSync(css1File, css1FileDataFinal);

  var css2File = `${outputFolder}/material/material-all_2.css`
  console.log(`${chalk.green("Step 5:")} clean up ${css2File}`)
  var css2FileData = fs.readFileSync(`${css2File}`, "utf8")
  var css2FileData2 = css2FileData.replace(/display:box/g, 'display:flex');
  var css2FileDataFinal = css2FileData2.replace(/:start/g, ':flex-start');
  fs.writeFileSync(css2File, css2FileDataFinal);

  var fromPackage = `./${toolkit}/package.json`
  var toPackage = `${outputFolder}/package.json`
  console.log(`${chalk.green("Step 6:")} copy ${fromPackage} to ${toPackage}`)
  fs.copySync(fromPackage,toPackage);

  var tempFolder = `${appFolder}/temp`
  console.log(`${chalk.green("Step 7:")} delete ${tempFolder}`)
  rimraf.sync(`${tempFolder}`);

  // var fromImages = `./${toolkit}/copy`
  // var toImages = `${outputFolder}/material`
  // console.log(`${chalk.green("Step 7:")} copy ${fromImages} to ${toImages}`)
  // fs.copySync(fromImages,toImages);

  console.log(`${chalk.green("done")} output folder is ${outputFolder}`)
}

async function _executeAsync (program, parms, outputPath, vars) {
  //console.log('')
  const crossSpawn = require('cross-spawn-with-kill')
  //let sencha = 'sencha'
  //let sencha; try { sencha = require('@sencha/cmd') } catch (e) { sencha = 'sencha' }
  var opts = { cwd: outputPath, silent: false, stdio: 'pipe', encoding: 'utf-8'}
  await new Promise((resolve, reject) => {
    //console.log(program)
    //console.log(parms)
    //console.log(opts)
    vars.child = crossSpawn(program, parms, opts)
    vars.child.on('close', (code, signal) => {
      if(code === 0) { console.log('');resolve(0); }
      else {
        console.log('error: ' + code)
        resolve(0)
      }
    })
    vars.child.on('error', (error) => {
      console.log('error:')
      console.log(error)
      resolve(0)
    })
    vars.child.stdout.on('data', (data) => {
      //var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      //write(`${str.slice(0,100)}`)
      //write(`${str}`)
      write(data.toString())
    })
    vars.child.stderr.on('data', (data) => {
      //var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      // if (!str.includes("Picked up _JAVA_OPTIONS")) {
      //   console.log(`${chalk.red("[ERR]")} ${str}`)
      // }
      write(data.toString())
    })
  })
}

function write(str) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${str}`)
}





  // console.log(`${chalk.green("Step 5:")} webpack - bundle theme, images and fonts`)

  // console.log(`${toolkit}`)
  // console.log(`${theme}`)
  // console.log(`${bundle}`)

  // await _executeAsync('webpack', [
  //   '--env.toolkit',`${toolkit}`,
  //   '--env.theme',`${theme}`,
  //   '--env.bundle',`${bundle}`,
  //   '--env.component',`${component}`,
  //   '--env.type','fewest', //fewest, smallest
  // ], `./`, vars);
  // console.log('')
  // console.log(`${chalk.green("Step 6:")} theme copied to: ${runtimeFolder}`)
  // //values.name = `ext-${toolkit}-${bundle}-${theme}`
  // //values.file = `ext.${toolkit}.${bundle}.${theme}.js`

  // if (component == undefined) {
  //   if (bundle == 'material-ui') {
  //     values.name = `ext-${toolkitshown}-theme`
  //     values.file = `ext.${toolkitshowndot}.theme.js`
  //   }
  //   else {
  //     values.name = `${toolkitshown}-${theme}`
  //     values.file = `${toolkitshowndot}.${theme}.js`
  //   }
  // }
  // else {
  //   if (bundle == 'material-ui') {
  //     values.name = `ext-${toolkitshown}-theme`
  //     values.file = `ext.${toolkitshowndot}.theme.js`
  //   }
  // }
  // console.log(`${chalk.green("Step 7:")} write ${runtimeFolder}/package.json`)
  // writeTemplateFile(`${templateFolder}/package.json.tpl`, `${runtimeFolder}/package.json`, values)

  // if (publish == 'yes') {
  //   console.log(`${chalk.green("Step 7a:")} publish theme ${runtimeFolder}/package.json`)
  //   await _executeAsync('npm', ['publish',`-force`], `${runtimeFolder}`, vars);
  // }

  //if(theme == 'material') {

  //   //var engineFolder = `./runtime/ext-${toolkit}-${bundle}-engine`
  //   //var engineFolder = `./runtime/${toolkitshown}-engine`
  //   var engineFolder = `./runtime/ext-${toolkitshown}-runtime`
  //   if (!fs.existsSync(engineFolder)) {mkdirp.sync(engineFolder)}
  //   var uglify = require("uglify-js");
  //   var inputFile = `${appFolder}/resources/engine/engine.js`

  //   console.log(`${chalk.green("Step 8:")} regex ${inputFile}`)
  //   var uncompressedData = fs.readFileSync(`${inputFile}`, "utf8")




  //   var udata1 = uncompressedData

  //   // function replacer(match) {
  //   //   console.log(match)
  //   //   return match;
  //   // }
  //   // var testdata = udata1
  //   // console.log('******')
  //   // testdata.replace(/\\/g, replacer);
  //   // //testdata.replace(/\`/g, replacer);
  //   // //testdata.replace(/\$\{\}/g, replacer);
  //   // //var result4 = testdata.replace(/[\\][3]/g, '\\\\3');
  //   // //testdata.replace(/[\\][3]/g, replacer);
  //   // console.log('******')




  //   var uresult1 = udata1.replace(/\\/g, '\\\\');
  //   var uresult2 = uresult1.replace(/\`/g, '\\\\\\`');
  //   var uresult3 = uresult2.replace(/\$\{\}/g, '\$ \{ \}');

  //   // var uresult1 = udata1.replace(/\\/g, '\\\\');
  //   // var uresult2 = uresult1.replace(/\`/g, '\\\\\\`');
  //   // var uresult3 = uresult2.replace(/\$\{\}/g, '\$ \{ \}');
  //   // //var result4 = result3.replace(/[\\][3]/g, '\\\\3');
  //   // var uresult4 = uresult3.replace(/[\\][3]/g, '');
  //   //var uncompressedOutFile = `./uncompressed/ext-${toolkit}-${bundle}-engine/ext.${toolkit}.${bundle}.engine.js`
  //   var uncompressedOutFile = `./uncompressed/ext-${toolkitshown}-engine/ext.${toolkitshowndot}.engine.js`
  //   console.log(`${chalk.green("Step 8a:")} create uncompressed after regex ${uncompressedOutFile}`)
  //   ensureDirectoryExistence(uncompressedOutFile)

  //   uresult4 = udata1
  //   console.log(`${chalk.green("Step 9:")} wrap uncompressed regex in createElement script`)


  //   //var uresult5 = udata1.replace(/"/g, '\"');

  //   //fs.writeFileSync(uncompressedOutFile, 'var s=document.createElement("script");s.type = "text/javascript";s.text =`' + uresult4 + '`;document.getElementsByTagName("head")[0].appendChild(s);');
  //   fs.writeFileSync(uncompressedOutFile, 'var s=document.createElement("script");s.type = "text/javascript";s.text =`' + uresult3 + '`;document.getElementsByTagName("head")[0].appendChild(s);');


  //   console.log(`${chalk.green("Step 10:")} uglifying - minifying`)
  //   var ugly = uglify.minify({
  //     "ext": fs.readFileSync(`${inputFile}`, "utf8")
  //   })
  //   var data1 = ugly.code
  //   var data1 = data1.replace(/\\/g, '\\\\');
  //   var data1 = data1.replace(/\`/g, '\\\\\\`');
  //   var data1 = data1.replace(/\$\{\}/g, '\$ \{ \}');
  //   //var result4 = result3.replace(/[\\][3]/g, '\\\\3');
  //   var data1 = data1.replace(/[\\][3]/g, '');

  //   // var result1 = data1.replace(/\\/g, '\\\\');
  //   // var result2 = result1.replace(/\`/g, '\\\\\\`');
  //   // var result3 = result2.replace(/\$\{\}/g, '\$ \{ \}');
  //   // //var result4 = result3.replace(/[\\][3]/g, '\\\\3');
  //   // var result4 = result3.replace(/[\\][3]/g, '');

  //   var result4 = data1

  //   var toFile = `${engineFolder}/ext.${toolkitshowndot}.engine.js`

  //   fs.writeFileSync(toFile, 'var s=document.createElement("script");s.type = "text/javascript";s.text =`' + result4 + '`;document.getElementsByTagName("head")[0].appendChild(s);');

  //   //console.log(`${chalk.green("Step 10:")} ufilify is done: ${engineFolder}/${toolkit}-${bundle}-engine.js`)
  //   //values.name = `ext-${toolkit}-${bundle}-engine`
  //   //values.file = `ext.${toolkit}.${bundle}.engine.js`

  //   console.log(`${chalk.green("Step 11:")} ufilify is done: ${engineFolder}/${toolkitshown}-engine.js`)
  //   values.name = `${toolkitshown}-engine`
  //   values.file = `${toolkitshowndot}.engine.js`

  //   console.log(`${chalk.green("Step 11:")} write ${engineFolder}/package.json`)
  //   writeTemplateFile(`${templateFolder}/package.json.tpl`, `${engineFolder}/package.json`, values)

  //   if (publish == 'yes') {
  //     console.log(`${chalk.green("Step 11a:")} publish engine ${engineFolder}/package.json`)
  //     await _executeAsync('npm', ['publish',`-force`], `${engineFolder}`, vars);
  //   }

  //   console.log(`${chalk.green("Step 12:")} done`)
  // //}
//}



// function ensureDirectoryExistence(filePath) {
//   var dirname = require("path").dirname(filePath);
//   if (fs.existsSync(dirname)) {
//     return true;
//   }
//   ensureDirectoryExistence(dirname);
//   fs.mkdirSync(dirname);
// }


// function getSenchaGenerateApp(toolkit, theme, appName) {
//   var appPath = `./${appName}`
//   var toolkitParm = `-${toolkit}`
//   var themeParm = `theme-${theme}`
//   return ['-sdk', '/Volumes/BOOTCAMP/aaExt/ext-7.2.0.67', 'generate', 'app', '-theme', themeParm, toolkitParm, appName, appPath]
// }

// function modifyAppJson(themeFolder) {
//   var appJsonFileName = `${themeFolder}/app.json`
//   var appJsonData = fs.readFileSync(appJsonFileName, 'utf8');
//   var appJsonDataWithoutComments = appJsonData.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');
//   const appJsonDataJson = JSON.parse(appJsonDataWithoutComments);

//   appJsonDataJson.slicer = null;

//   // if (appJsonDataJson.requires.length == 1) {
//   //   if (appJsonDataJson.requires[0] == "font-awesome") {
//   //     appJsonDataJson.requires.push("font-ext");
//   //     appJsonDataJson.requires.push("ux");
//   //     appJsonDataJson.requires.push("d3");
//   //     appJsonDataJson.requires.push("pivot-d3");
//   //     appJsonDataJson.requires.push("exporter");
//   //     appJsonDataJson.requires.push("pivot");
//   //     appJsonDataJson.requires.push("calendar");
//   //     appJsonDataJson.requires.push("charts");
//   //   }
//   // }

//   //appJsonDataJson.output.js = {"version": "ES6"};
//   appJsonDataJson.language = {"js": {"input": "ES5","output": "ES5"}}

//   const appJsonNewString = JSON.stringify(appJsonDataJson, null, 2);
//   fs.writeFileSync(appJsonFileName, appJsonNewString);

// }

// function modifyAppJs(themeFolder) {
//   fs.copySync(`${themeFolder}/app.js`,`${themeFolder}/app.back.js`);
//   var appJsData = fs.readFileSync(`${themeFolder}/app.js`, 'utf8');
//   b = `    ,'Ext.*'\n`
//   var position = appJsData.indexOf('],');
//   var appJsDataNew = appJsData.substring(0, position) + b + appJsData.substring(position);
//   fs.writeFileSync(`${themeFolder}/app.js`, appJsDataNew);
// }

// function writeTemplateFile (tplFile, outFile, vars) {
//   require("./XTemplate");
//   //var path = require("path");
//   var fs = require("fs-extra");
//   var tpl = new Ext.XTemplate(fs.readFileSync(tplFile));
//   var t = tpl.apply(vars);
//   fs.writeFileSync(outFile, t);
//   delete tpl;
// }

// function processErrors(vars) {
//   var v = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
//   v.forEach(eventType => {
//     process.on(eventType, function(eventType){
//       if (vars.child != null) {
//         console.log('\nnode process and sencha cmd process ended')
//         vars.child.kill();
//         vars.child = null;
//       }
//       else {
//         if (eventType != 0) {
//           console.log('\nnode process ended')
//         }
//       }
//       process.exit();
//     });
//   })
// }


