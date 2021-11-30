'use strict'

const extension = {
  verify() {
    if (document.querySelector('.__find-font__')) {
      extension.remove()
    } else {
      extension.init()
    }
  },

  verifyFromExtension(arrElements) {
    return arrElements.find(el => {
      if (el.classList) {
        return (
          el.classList.contains('__find-font__') ||
          el.classList.contains('__font-description__')
        )
      }
    })
  },

  insertIntoBody: el => document.body.append(el),

  findStyles: (e, style) =>
    window.getComputedStyle(e.path[0]).getPropertyValue(style),

  handleClick(e) {
    if (extension.verifyFromExtension(e.path)) return false

    const elementDescription = document.createElement('div')
    elementDescription.classList.add('__font-description__')

    elementDescription.innerHTML = `
      <header>
          <h2>${
            extension.findStyles(e, 'font-family').split(',')[0]
          } - ${extension.findStyles(e, 'font-weight')}</h2>
    
        <button type="button">&#215;</button>
      </header>
    
      <div class="infos">
        <dl>
          <dt>Font Family</dt>
          <dd>${extension.findStyles(e, 'font-family')}</dd>
        </dl>
        <dl>
          <dt>Font Size</dt>
          <dd>${extension.findStyles(e, 'font-size')}</dd>
        </dl>
        <dl>
          <dt>Font Style</dt>
          <dd>${extension.findStyles(e, 'font-style')}</dd>
        </dl>
        <dl>
          <dt>Font Weight</dt>
          <dd>${extension.findStyles(e, 'font-weight')}</dd>
        </dl>
        <dl>
          <dt>Line Height</dt>
          <dd>${extension.findStyles(e, 'line-height')}</dd>
        </dl>
      </div>
      `

    elementDescription.style.top = `${e.pageY + 10}px`
    elementDescription.style.left = `${e.pageX}px`

    const removeThisElement = () => {
      elementDescription.remove()
    }

    elementDescription
      .querySelector('button')
      .addEventListener('click', removeThisElement)

    extension.insertIntoBody(elementDescription)
  },

  removeFontTolltip: () => {
    const fontElement = document.querySelector('.__font__')

    if (fontElement) {
      fontElement.remove()
    }
  },

  preventDefaultLinks: e => e.preventDefault(),

  createFontElement() {
    const fontElement = document.createElement('div')
    fontElement.classList.add('__font__')
    document.body.append(fontElement)
    return fontElement
  },

  handleMouseMove: e => {
    let fontElement = document.querySelector('.__font__')

    if (extension.verifyFromExtension(e.path)) {
      if (fontElement) fontElement.remove()
      return false
    }

    if (!fontElement) fontElement = extension.createFontElement()

    const fontHover = extension.findStyles(e, 'font-family').split(',')[0]
    fontElement.innerText = fontHover

    fontElement.style.top = `${e.pageY + 20}px`
    if (e.pageX + 200 > window.innerWidth) {
      fontElement.style.left = `${e.pageX - 150}px`
    } else {
      fontElement.style.left = `${e.pageX + 20}px`
    }
  },

  remove() {
    document.body.style.cursor = 'default'
    const buttonLeaveRemove = document.querySelector('.__find-font__')
    buttonLeaveRemove.remove()

    const popupsFont = document.querySelectorAll('.__font-description__')
    if (popupsFont) {
      popupsFont.forEach(popupFont => popupFont.remove())
    }

    document.body.removeEventListener('click', extension.handleClick)

    document.body.removeEventListener('mouseleave', extension.removeFontTolltip)

    const links = document.querySelectorAll('a')
    links.forEach(link => {
      link.removeEventListener('click', extension.preventDefaultLinks)
    })

    document.body.removeEventListener('mousemove', extension.handleMouseMove)
  },

  init() {
    document.body.style.cursor = 'crosshair'
    const buttonLeave = document.createElement('div')
    buttonLeave.classList.add('__find-font__')
    buttonLeave.innerHTML = `<div>leave</div>`

    extension.insertIntoBody(buttonLeave)

    buttonLeave.addEventListener('click', extension.remove)

    document.body.addEventListener('click', extension.handleClick)

    document.body.addEventListener('mouseleave', extension.removeFontTolltip)

    const links = document.querySelectorAll('a')
    links.forEach(link => {
      link.addEventListener('click', extension.preventDefaultLinks)
    })

    document.body.addEventListener('mousemove', extension.handleMouseMove)
  }
}

chrome.runtime.onMessage.addListener(extension.verify)
