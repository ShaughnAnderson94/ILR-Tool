# ILR_File_Creator

## Overview:
The DFE tool for creating XML files that can be uploaded to their website is slow and limited in its function. My organization an Airtable that contains all the information it asks for but its hard to move all that information into the DFE tool. To fix this we built a new ILR tool that takes the CSV values generated from our Airtable and processes them to a XML file automatically. If you want to create a similar Airtable or Excell document that can be fed into this tool a CSV for creating one is at the bottom of the readme. This project is an electron application and following the set up instruction will create an app for whatever operating system you build it on. If you want to make aplications for other operating systems more information about distributing electron apps with electron forge can be found [here]([url](https://www.electronforge.io/)).

## User Stories

* User can upload a cvs file to application
* App will tell user if there are any empty or missing fields in the CSV list
* App will return a XML file to the user thats structure matches that required by the DFE

* ## Libraires Used

* electron

* electron forge

* xmllint

* papaparse



## Usage
This repo can be used to update and create copies of the ILR tool app. Bellow I will give general instructions for making creating copies of the app and how to update the tool when the ILR produces new versions. (note I can not account for everything they might change in a version and future users may need to update the code to account for changes made in a new academic year) Finally I will provide instructions for how to use the app and organize your table.

### Set Up

First make sure your computer is set up with a functional terminal as well as npm, GIT, and a code editor like VS code. A guide for creating this set up can be found [here](https://foundersandcoders.notion.site/Installation-Guide-6fdc64ecf0ea4e6f8773075b02752c22).

From there open a terminal and navigate to where you would like the repo to go on your computer. The first 4 steps of [this command line guide](https://medium.com/swlh/how-to-use-the-command-line-interface-cli-9c8b70e568e) will help if you are not familiar with using your terminal.

Once you are in the right area, use the following commands to download open and set up the project

```bash
# Download Project
git clone https://github.com/foundersandcoders/ILR_File_Creator.git

# Navigate to the project directory
cd ILR_File_Creator

# Install dependencies
npm install
```

From here you are ready to make your copies of the app which you can use or share. the following commands will create a version of the app for whatever operating system you use.

```bash
# Packages app
npm run package

# Builds app
npm run make
```
After running these commands you should see something like in your code editor 
![a picture of file structures](image.png)

The app will appear within the make folder which is inside the out folder. In this photo I am making a mac os version so we have a Darwin zip file and a .dmg file but the exact outputs will vary depending on your computer. You can left click to open these in your finder and then copy them to wherever you want to use them from.

### Updating With ILR Tool
When the academic year changes and the official ILR application is updated along with the schema you will need to make at lease two adjustments to this project. 

First go on the DFE website and find the schema for the current academic years XMLS. They can usually be found somewhere within [this part](https://guidance.submit-learner-data.service.gov.uk/) of the DFE website. Once you find the schema copy its content and use it to replace the content of schemafile.xsd, which is the 2024-25 version of the schema.

2nd, download the official version of the ILR application on a windows computer. Left click on it and look at the application information to find the version it should be something like 2425.1.49.0 (note there is a shorter version of this version code displayed in application when you open it you want the long version) Keep this version code on hand since the ILR tool will require it to be input along with the CVS.

### Application Usage 
When you open the application it asks for the version code discussed above and a CSV (more details bellow). Once these are supplied the tool will display error messages and warnings. Warnings are fine and one or two are usually produced but if there are errors you wont be able to upload to the DFE's website until they are resolved. (you will get the line in the XML where there error is to help find it) You can click a button to download this XML file to your computer and then upload it to the DFE website. I want to end this by saying how to organize your table so it produces the correct CSV files. The columns should be as follows in the exact order. If you dont have information for a row leave it blank do not put in place holder values.

Use this CVS file to organize your data
[ ILR data export(template) .csv](https://github.com/user-attachments/files/19339597/ILR.data.export.template.csv)
