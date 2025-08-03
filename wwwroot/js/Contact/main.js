/**
 * Initializes auto-dismiss behavior for success alerts.
 *
 * Imports the alert utility and applies it to fade out success messages
 * after a short delay.
 */
import { autoDismissAlert } from './form.js';

autoDismissAlert({
  selector: '.alert-success',
  timeout: 5000,
  fadeDuration: 500,
});
