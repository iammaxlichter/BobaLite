import { autoDismissAlert } from './form.js';

autoDismissAlert({
  selector: '.alert-success',
  timeout: 5000,
  fadeDuration: 500,
});
