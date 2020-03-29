import { Meteor } from 'meteor/meteor';
import React, { useState, Component} from 'react';
import { useTracker } from 'meteor/react-meteor-data'

import IndividualFile from './IndividualFile.jsx';
import UserFiles from '../api/userFiles'

const searchSubscription = () => useTracker(() => {
  const filesHandle = Meteor.subscribe('files.all');
  const docsReadyYet = filesHandle.ready();
  const files = UserFiles.find({}, {sort: {name: 1}}).fetch();
  return {
    docsReadyYet,
    files
  }
}, [])


export default function FileUploadComponent (props) {

  const { docsReadyYet, files } = searchSubscription()
  const [uploading, setUploading] = useState([]);
  const [progress, setProgress] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const showMap = files.map(file => makeList(file))

  function makeList(file) 
  {
    let link = UserFiles.findOne({_id: file._id}).link();

    return  <React.Fragment key={file._id}>  
              <IndividualFile fileName={file.name} fileUrl={link} fileId={file._id} fileSize={file.size} />
            </React.Fragment> 
  }

  function uploadIt(e) {
    e.preventDefault();

    //console.log(e.target.value)

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];

      if (file) {
        let uploadInstance = UserFiles.insert({
          file: file,
          meta: {
            locator: props.fileLocator
            //userId: Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)

        setUploading(uploadInstance);
        setInProgress(true);

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting');
        })

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj);
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj);

          // Remove the filename from the upload box
          //refs['fileinput'].value = '';

          // Reset our state for the next file
          setUploading([]);
          setProgress(0);
          setInProgress(false);  
        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          setProgress(progress)
        });

        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  function showUploads() {
    console.log('**********************************', uploading);

    //if (!_.isEmpty(this.state.uploading)) {
      if(uploading.length !== 0) {
      return <div>
        {uploading.file.name}

        <div className="progress progress-bar-default">
          <div style={{width: progress + '%'}} aria-valuemax="100"
             aria-valuemin="0"
             aria-valuenow={progress || 0} role="progressbar"
             className="progress-bar">
            <span className="sr-only">{progress}% Complete (success)</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    }
  }

  //let filesOK = (files !== undefined);

  return docsReadyYet ?  showSection () : '' ;

  function showSection () {

    return (
      <div>
        <div className="row">
          <div className="col s12 m12">
            <p>Upload New File:</p>

            <div className="btn-upload">
              <label htmlFor="fileinput" className="btn-floating btn-large waves-effect waves-light red">
                <i className="material-icons" >add</i>
              </label>
              <input type="file" id="fileinput" disabled={inProgress}  onChange={e => uploadIt(e)} />
            </div>

          </div>
        </div>

        <div className="row">
          <div className="col s12 m12">
            {showUploads()}
          </div>
        </div>

        <div className="col s12 m12 ">
          <table  >
            <thead>
              <tr>
                <th>Pic</th>
                <th>Name</th>   
                <th>Size</th>
                <th>Rename</th>
                <th>Delete</th>          
              </tr>
            </thead>

            <tbody>
            {showMap}
            </tbody>

          </table>
        </div>
      </div>
    )
  }
}