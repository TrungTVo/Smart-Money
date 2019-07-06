import React, { Component } from 'react';

export class Footer extends Component {
  render() {
    return (
      <footer className="bg-primary text-white p-4 d-flex align-items-center">
          <p className='m-auto text-center' >Copyright &copy; Trung Vo</p>
          <div>
            <a href='https://www.facebook.com/vo.thanhtrung.3110' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}} className='fab fa-2x fa-facebook-square'><span>&nbsp;&nbsp;</span></a>
            <a href='https://www.instagram.com/trungtvo/' target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className='fab fa-2x fa-instagram'><span>&nbsp;&nbsp;</span></a>
            <a href='https://www.youtube.com/channel/UChSVwCTUww1UJFNDDVrk2dQ?view_as=subscriber' target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className='fab fa-2x fa-youtube'><span>&nbsp;&nbsp;</span></a>
          </div>
      </footer>
    )
  }
}

export default Footer;
