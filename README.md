# documentation of the theme and engine npm package generation process


1) With Sencha Cmd, generate a universal app (both classic and modern toolkits) with the latest release of the SDK, for example:

```
sencha -sdk  /Volumes/BOOTCAMP/aaExt/ext-7.3.0 generate app reference-app ./reference-app
```

- this command will create an 'ext' folder in the ./reference-app folder
- you can use this 'ext' folder created by this command for the next 2 steps

2) replace the 'ext' folder for both modern and classic

- in ./modern folder
  - replace ./modern/ext with new SDK version ('ext' folder from above)
  - replace version property in ./modern/package.json

- in ./classic folder
  - replace ./classic/ext with new SDK version ('ext' folder from above)
  - replace version property in ./classic/package.json

3) generate the packages

- run: npm install
- run: npm run modern
- run: npm run classic

When completed, the packages folder will have these 2 npm packages:

- ext-classic-runtime
- ext-modern-runtime

both of these packages need to be installed into npm

- run: ./packages/ext-modern-runtime/npm publish
- run: ./packages/ext-classic-runtime/npm publish
