const DownloadButton = ({colorChanges}) => {
      const download = (event) => {
        event.preventDefault();
        if(typeof colorChanges == 'object') {
          const blob = new Blob([colorChanges.join('\n')]);
          saveAs(blob, `inking.txt`);
        }
        else if(typeof colorChanges == 'string') {
          const blob = new Blob([colorChanges]);
          saveAs(blob, `inking.txt`);
        }
    }
    return (
      <button 
        className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg'
        onClick={download}>
        Download Inking File
      </button>
    )
}
export default DownloadButton;