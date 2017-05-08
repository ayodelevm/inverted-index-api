/**
 * Class representing Data errors
 */
export default class DataError {
  /**
   * Creates the error message and it's filename property
   * @param {String} errorMessage - represents the unique error message a file with errors returns
   * @param {*} filename - the name of file with error
   */
  constructor(errorMessage, filename) {
    this.errorMessage = errorMessage;
    this.filename = filename;
  }
}
