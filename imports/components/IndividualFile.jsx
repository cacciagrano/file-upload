import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default function IndividualFile (props) {

  function removeFile(){
    let conf = confirm('Are you sure you want to delete the file?') || false;
    if (conf == true) {
      Meteor.call('RemoveFile', props.fileId, function (err, res) {
        if (err)
          console.log(err);
      })
    }
  }

  function  renameFile(){
    let validName = /[^a-zA-Z0-9 \.:\+()\-_%!&]/gi;
    let prompt    = window.prompt('New file name?', props.fileName);

    // Replace any non valid characters, also do this on the server
    if (prompt) {
      prompt = prompt.replace(validName, '-');
      prompt.trim();
    }

    //if (!_.isEmpty(prompt)) {
    if (prompt.length !== 0) {
      Meteor.call('RenameFile', props.fileId, prompt, function (err, res) {
        if (err)
          console.log(err);
      })
    }
  }

  return (
    <tr>
      <td>
        <a href={props.fileUrl} target="_blank"><img className="thumb" src={props.fileUrl} /></a>
      </td>
      <td>
        <strong>{props.fileName}</strong> 
      </td>
      <td>
          Size: {props.fileSize}
      </td>
      <td>
        <button onClick={(e) => renameFile(e)} className="btn">Rename</button>
      </td>
      <td>
        <button onClick={(e) => removeFile(e)} className="btn">Delete</button>
      </td>
    </tr>
    ) 
}

IndividualFile.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  fileUrl: PropTypes.string,
  fileId: PropTypes.string.isRequired
}