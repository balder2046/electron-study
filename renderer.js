// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const marked = require('marked')
const {remote,ipcRenderer} = require('electron')
const path = require('path')
const mainProcess = remote.require('./main.js')
const currentWindow = remote.getCurrentWindow()
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html')
const newButton = document.querySelector('#new-file')
const openButton = document.querySelector('#open-file')
const saveMarkdownButton = document.querySelector('#save-markdown')
const revertButton = document.querySelector('#revert')
const saveHtmlButton = document.querySelector('#save-html')
const showFileButton = document.querySelector('#show-file')
const openInDefaultButton = document.querySelector('#open-in-default')
let filePath = null
let originalContent = ''
const renderMarkdownToHtml = (markdown)=>{
    
    htmlView.innerHTML = marked(markdown,{sanitize:true})
    
}
const updateUserInterface = (filename)=>{
    let title = 'fire sale'
    if (filename){
        title = `${path.basename(filename)} - ${title}`
    }
    currentWindow.setTitle(title)
    
}
markdownView.addEventListener('keyup',(event)=>{
    renderMarkdownToHtml(event.target.value)
})
openButton.addEventListener("click",(event)=>{
    mainProcess.getFileFromUser(currentWindow)
})
newButton.addEventListener('click',(event)=>{
    mainProcess.createWindow()
})
ipcRenderer.on('file-opened',(event,file,content)=>{
    originalContent = content
    filePath = file
    markdownView.value = content
    renderMarkdownToHtml(content)
    updateUserInterface(file)

})