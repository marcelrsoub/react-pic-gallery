import React from 'react'

let styles: {
  [key: string]: React.CSSProperties
} = {}

styles.lightbox = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `rgba(0, 0, 0, 0.454)`,
  backdropFilter: 'blur(6px)',
  zIndex: 9999999,
  display: 'grid',
  gridTemplateRows: '60px | auto | 300px',
  justifyContent: 'center',
  alignContent: 'center'
}

styles.topCustomContent = {
  position: 'absolute',
  top: 0
}
styles.bottomCustomContent = {
  position: 'absolute',
  bottom: 0
}
styles.LbButton = {
  float: 'right',
  textDecoration: 'none',
  color: 'white',
  padding: '5px',
  border: '1px solid white',
  borderRadius: '5px'
}
styles.ABtn = {
  float: 'right',
  textDecoration: 'none',
  color: 'white'
}

styles.DescriptionDiv = {
  background: 'white',
  padding: '10px',
  color: '#666',
  textAlign: 'center',
  position: 'relative',
  zIndex: -1
}

styles.Wrapper = {
  display: 'flex',
  width: '100%',
  minWidth: 200,
  height: '100%'
}

styles.Grid = {
  display: 'grid',
  gridTemplateRows: '1fr',
  gap: '2px',
  width: '100%',
  height: 'auto'
}

export default styles
