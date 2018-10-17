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

function preventEventDefault(event){
    event.preventDefault()
}

// drag functions
document.addEventListener('dragstart',preventEventDefault)
document.addEventListener('dragover', preventEventDefault)
document.addEventListener('dragleave',preventEventDefault)
document.addEventListener('drop',preventEventDefault)

const getDraggedFile = (event)=>{
    return event.dataTransfer.items[0]
}
const getDroppedFile = (event)=>{
    return event.dataTransfer.files[0]
}
const fileTypeIsSupported = (file)=>{
    return ['text/plain','text/markdown'].includes(file.type)
}

markdownView.addEventListener('dragover',(event)=>{
    const file = getDraggedFile(event)
    console.log(file)
    if (fileTypeIsSupported(file))
    {
        markdownView.classList.add('drag-over')
    }
    else{
        markdownView.classList.add('drag-error')
    }
})
markdownView.addEventListener('dragleave',(event)=>{
    markdownView.classList.remove('drag-over')
    markdownView.classList.remove('drag-error')
})
markdownView.addEventListener('dragexit',(event)=>{
    markdownView.classList.remove('drag-over')
    markdownView.classList.remove('drag-error')
})

markdownView.addEventListener('drop',(event)=>{
    const file = getDroppedFile(event)
    console.log(file.type)
    if (fileTypeIsSupported(file))
    {
        mainProcess.openFile(file,currentwindow)
    }
    else
    {
        alert("not support filetype")
    }
})
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
revertButton.addEventListener('click',(event)=>{
    markdownView.value = originalContent
    renderMarkdownToHtml(originalContent)
})
ipcRenderer.on('file-opened',(event,file,content)=>{
    
    filePath = file
    markdownView.value = content
    originalContent = markdownView.value
    renderMarkdownToHtml(content)
    updateUserInterface(false)

})