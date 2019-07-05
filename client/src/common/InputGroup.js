import React, { Component } from 'react';

export class InputGroup extends Component {
  render() {
    const {
      htmlFor, label, type, required, value,
      id, name, onChange, placeholder, error, iconType
    } = this.props;
    
    return (
      <div className="form-group">
        <label htmlFor={htmlFor}>
          {label} {required ? <span style={{color: 'red'}}>*</span>:null}
        </label>
        {
          name === 'message' ? 
            <textarea className={"form-control " + (error ? "is-invalid border border-danger" : "")}
              name="message" onChange={onChange} value={value}
                id="message" rows="6" placeholder='Enter your message'></textarea>
            :
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1"><i className={'fas fa-' + iconType}></i></span>
              </div>
              <input type={type} id={id} name={name} onChange={onChange} value={value}
                className={"form-control " + (error ? "is-invalid border border-danger" : "")} placeholder={placeholder} />
            </div>
        }
        
        {error && <small className="form-text" style={{color: 'red'}}>{error}</small>}
      </div>
    )
  }
}

export default InputGroup;
