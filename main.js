function initExtension() {
  const removeFontTolltip = () => {
    const fontElement = document.querySelector('.__font__')

    if (fontElement) {
      fontElement.remove()
    }
  }

  function removeExtension() {
    document.body.style.cursor = 'default'
    const buttonLeaveRemove = document.querySelector('.__find-font__')
    buttonLeaveRemove.remove()

    const popupsFont = document.querySelectorAll('.__font-description__')
    if (popupsFont) {
      popupsFont.forEach(popupFont => popupFont.remove())
    }

    document.body.removeEventListener('click', handleClick)

    document.body.removeEventListener('mouseleave', removeFontTolltip)

    const links = document.querySelectorAll('a')
    links.forEach(link => {
      link.removeEventListener('click', e => e.preventDefault())
    })

    document.body.removeEventListener('mousemove', handleMouseMove)
  }

  if (document.querySelector('.__find-font__')) {
    removeExtension()
    return true
  }

  const handleMouseMove = e => {
    console.log('1')
    let fontElement = document.querySelector('.__font__')

    if (verify(e.path)) {
      if (fontElement) fontElement.remove()
      return false
    }

    if (!fontElement) fontElement = createFontElement()

    const fontHover = findStyles(e, 'font-family').split(',')[0]
    fontElement.innerText = fontHover

    fontElement.style.top = `${e.pageY + 20}px`
    if (e.pageX + 200 > window.innerWidth) {
      fontElement.style.left = `${e.pageX - 150}px`
    } else {
      fontElement.style.left = `${e.pageX + 20}px`
    }
  }

  document.body.style.cursor = 'crosshair'
  const buttonLeave = document.createElement('div')
  buttonLeave.classList.add('__find-font__')
  buttonLeave.innerHTML = `<div>leave</div>`

  const insertIntoBody = el => document.body.append(el)

  insertIntoBody(buttonLeave)

  buttonLeave.addEventListener('click', removeExtension)

  const createFontElement = () => {
    const fontElement = document.createElement('div')
    fontElement.classList.add('__font__')
    document.body.append(fontElement)
    return fontElement
  }

  const verify = arrElements => {
    return arrElements.find(el => {
      if (el.classList) {
        return (
          el.classList.contains('__find-font__') ||
          el.classList.contains('__font-description__')
        )
      }
    })
  }

  const findStyles = (e, style) =>
    window.getComputedStyle(e.path[0]).getPropertyValue(style)

  function handleClick(e) {
    if (verify(e.path)) return false

    const elementDescription = document.createElement('div')
    elementDescription.classList.add('__font-description__')

    elementDescription.innerHTML = `
    <header>
        <h2>${findStyles(e, 'font-family').split(',')[0]} - ${findStyles(
      e,
      'font-weight'
    )}</h2>
  
      <button type="button">&#215;</button>
    </header>
  
    <div class="infos">
      <dl>
        <dt>Font Family</dt>
        <dd>${findStyles(e, 'font-family')}</dd>
      </dl>
      <dl>
        <dt>Font Size</dt>
        <dd>${findStyles(e, 'font-size')}</dd>
      </dl>
      <dl>
        <dt>Font Style</dt>
        <dd>${findStyles(e, 'font-style')}</dd>
      </dl>
      <dl>
        <dt>Font Weight</dt>
        <dd>${findStyles(e, 'font-weight')}</dd>
      </dl>
      <dl>
        <dt>Line Height</dt>
        <dd>${findStyles(e, 'line-height')}</dd>
      </dl>
    </div>
    `

    elementDescription.style.top = `${e.pageY + 10}px`
    elementDescription.style.left = `${e.pageX}px`

    const removeThisElement = e => {
      elementDescription.remove()
    }

    elementDescription
      .querySelector('button')
      .addEventListener('click', removeThisElement)

    insertIntoBody(elementDescription)
  }

  document.body.addEventListener('click', handleClick)

  document.body.addEventListener('mouseleave', removeFontTolltip)

  const links = document.querySelectorAll('a')
  links.forEach(link => {
    link.addEventListener('click', e => e.preventDefault())
  })

  document.body.addEventListener('mousemove', handleMouseMove)
}

chrome.runtime.onMessage.addListener(initExtension)
