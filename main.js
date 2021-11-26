const div = document.createElement('div')
div.classList.add('__find-font__')
div.innerHTML = `<div>leave</div>`

document.body.append(div)

function createFontElement() {
  const fontElement = document.createElement('div')
  fontElement.classList.add('__font__')
  document.body.append(fontElement)
  return fontElement
}

const handleClick = () => {}

const handleMouseMove = e => {
  let fontElement = document.querySelector('.__font__')
  if (!fontElement) fontElement = createFontElement()

  fontElement.style.top = `${e.pageY + 20}px`

  const styleHover = window.getComputedStyle(e.path[0])

  const fontHover = styleHover.getPropertyValue('font-family').split(',')[0]
  fontElement.innerText = fontHover

  if (e.pageX + 200 > window.innerWidth) {
    fontElement.style.left = `${e.pageX - 150}px`
  } else {
    fontElement.style.left = `${e.pageX + 20}px`
  }

  document.body.addEventListener('click', () => {
    handleClick()
  })
}

document.body.addEventListener('mouseleave', e => {
  const fontElement = document.querySelector('.__font__')

  if (fontElement) {
    fontElement.remove()
  }
})

document.body.addEventListener('mousemove', handleMouseMove)
