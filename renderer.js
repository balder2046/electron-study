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
const updateUserInterface = (isEdited)=>{
    let title = 'fire sale'
    if (filePath){
        title = `${path.basename(filePath)} - ${title}`
        if (isEdited) title = `${title} (Edited)`
    }
    currentWindow.setTitle(title)
    currentWindow.setDocumentEdited(isEdited)
    revertButton.disabled = !isEdited
    saveMarkdownButton.disabled = !isEdited
    
}
markdownView.addEventListener('keyup',(event)=>{
    
    renderMarkdownToHtml(event.target.value)
    updateUserInterface(event.target.value !== originalContent)
    
})
openButton.addEventListener("click",(event)=>{
    mainProcess.getFileFromUser(currentWindow)
})
newButton.addEventListener('click',(event)=>{
    mainProcess.createWindow()
})
saveHtmlButton.addEventListener('click',(event)=>{
    const content = htmlView.innerHTML
    mainProcess.saveHTML(currentWindow,content)
})
saveMarkdownButton.addEventListener('click',(event)=>{
    const content = markdownView.value
    mainProcess.saveMarkdown(currentWindow,filePath,content)

})
ipcRenderer.on('file-opened',(event,file,content)=>{
    
    filePath = file
    markdownView.value = content
    originalContent = markdownView.value
    renderMarkdownToHtml(content)
    updateUserInterface(false)

})