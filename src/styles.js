let styles = {}

styles.ModalDiv = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `rgba(0, 0, 0, 0.774)`,
  /* backdrop-filter: blur(6px), */
  display: 'flex',
  zIndex: 9999999,
  justifyContent: 'center'
}

styles.LbButtonsDiv = {
  position: 'absolute',
  top: '10px',
  width: 'calc(100% - 20px)'
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
  position: 'fixed',
  bottom: '0px',
  padding: '10px',
  width: '100%',
  color: '#666',
  textAlign: 'center',
  maxHeight: '60px',
  overflowY: 'scroll'
}

styles.Wrapper = {
  display: 'flex',
  width: '100%',
  minWidth: 200,
  height: '100%'
}

styles.Grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: '1fr',
  gap: '2px',
  width: '100%',
  height: 'auto'
}

export default styles;