import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import {firebaseApp} from './service/firease';
import AuthService from './service/auth_service';
import ImageUploader from './service/image_uploader';
import ImageFileInput from './components/image_file_input/image_file_input';
import CardRepository from './service/card_repository';

const authService = new AuthService(firebaseApp);
const cardRepository = new CardRepository(firebaseApp);
const imageUploader = new ImageUploader();
const FileInput = memo(props => (<ImageFileInput {...props} imageUploader={imageUploader} />));

ReactDOM.render(
  <React.StrictMode>
    <App FileInput={FileInput} authService={authService} cardRepository={cardRepository} />
  </React.StrictMode>,
  document.getElementById('root')
);
