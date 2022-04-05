const DownloadButton = props => {
    const downloadFile = () => {
      window.location.href = "https://images.unsplash.com/photo-1648142504219-d13505bcac0e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
      window.target = "_blank"
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg" 
            onClick={downloadFile} />
    )
}
export default DownloadButton;