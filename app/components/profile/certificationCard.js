import { useEffect, useState } from "react";

export default function CertificationCard({ index, cert, setNewCert, isLoading, setIsLoading, setErrorMessage, onSave, onRemove}) {
  
  const [selectedCert, setSelectedCert] = useState(null);
  
  const [editingCert, setEditingCert] = useState(cert);

  useEffect(() => { setNewCert(editingCert)}, [editingCert])

  return (
    <div 
      className={`w-full border border-gray-400 rounded-lg p-4 mb-3 
                  ${(!selectedCert && cert) && 'bg-white'} 
                  ${(selectedCert != cert) && 'bg-gray-300'}`}
    >
      {/* View */}
      {(!selectedCert && cert) && (
        <div className="w-full flex justify-center">
          <h2 className="flex-3 text-base font-bold text-black">{cert}</h2>
          <button 
            className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
            onClick={() => { 
              if (isLoading) setErrorMessage("Certification must be saved to continue");
              else {
                // console.log("edit skill card: ", cert);
                setNewCert(cert);
                setSelectedCert(cert); 
                setIsLoading(true);
              }
            }}
          >Edit</button>
          <button className="text-[#E55B3C] text-base font-bold hover:underline ml-5" 
            onClick={() => onRemove(index)}
          >Remove</button>
        </div>
      )}

      {/* Edit  */}
      {(selectedCert === cert || !cert) && (
        <form 
          className="w-full flex justify-between" 
          onSubmit={() => { 
            onSave(index); 
            setSelectedCert(null); }}
        >
          <div className="flex-1">
            <label className="inline-block w-25 text-base  font-normal text-black">Name:</label>
            <input
              required
              type="text"
              value={editingCert}
              onChange={(e) => setEditingCert(e.target.value)}
              placeholder="Ex: Certified Data Analyst"
              className="w-auto h-10 px-4 py-2 text-black bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55B3C]"
            />
          </div>
          <button 
            type="submit"
            className="text-[#E55B3C] text-base font-bold hover:underline ml-5"
          >Save</button>
        </form>
      )}
    </div>
  );
}