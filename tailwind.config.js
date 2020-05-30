module.exports = {
  purge: [],
  theme: {
    extend: {
      rotate: {
        '6': '6deg',
        '-6': '-6deg'
      },
      colors: {
        primary: '#E49D22',
        secondary: '#D4F4FF',
        tertiary: '#FFECCC',
        background: '#2A3744',
        foreground: '#586674'
      },
      scale: {
        'mirror-x': '-1'
      }
    }   
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'group-hover'],
    scale: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: [],
}
