import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ResumeCard({ type = "resume", file, isEdit=true }) {
  const router = useRouter();

  if (!file || file.error) return null;
  
  return (
    <div className="w-full h20 max-w-sm rounded-2xl bg-white border border-[#E55B3C]">
      <div className="w-full flex px-2 py-2 justify-center bg-[#E55B3C]/90 rounded-t-2xl">
        <div className="text-white text-base font-bold mt-2 ml-2 flex-3">Database {type == "resume" ? "Resume" : "Cover Letter"}</div>
        {isEdit && <button  
          className="text-white hover:bg-[#d14f32] py-2 px-2 rounded-full transition-colors"
          aria-label="Modify Item"
          onClick={() => router.push(`/profile?tab=profile`)}
        >
          <Pencil size={20} className="w-5 h-5" /> 
        </button>}
      </div>
        <div className="px-4 pt-2 pb-4">
          <div className="text-center">
            <div className="text-base font-medium text-black mb-1">
              {file.first_name} {file.last_name}
            </div>
            <p className="text-sm font-medium text-black mb-2">{file.email}</p>
          </div>
          <div className="text-base text-gray-500 leading-relaxed h-85 overflow-y-auto">
              {type === "resume" ? (
                <>
                  <div>
                    <b className="text-sm">Summary: </b>
                    <p className="text-sm pl-5 pt-1">{file.summary}</p>
                  </div>

                  <div className="mt-2 text-sm">
                    <b>Education: </b>
                    <ul className="pl-5 pt-1">
                      {file.education.map((edu, index) => {
                        let eduSplit = edu.split(' | ');
                        return(
                          <li key={index}>{`${eduSplit[1]} in ${eduSplit[2]} from ${eduSplit[0]} (${eduSplit[3]}-${eduSplit[4]})`}</li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-2 text-sm">
                    <b>Certification: </b>
                    <div className="pl-5 pt-1">
                    {file.certifications.map((crt, index) => 
                      <span
                        key={index}
                        className="mr-2 px-2 py-1 bg-gray-200 rounded font-normal text-black"
                      >
                        {crt}
                      </span>
                    )}
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <b>Skills: </b>
                    <div className="pl-5 pt-1">
                    {file.skills.map((skill, index) => 
                      <span
                        key={index}
                        className="mr-2 px-2 py-1 bg-gray-200 rounded font-normal text-black"
                      >
                        {skill}
                      </span>
                    )}
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <b>Experience: </b>
                    <ul className="pl-5 pt-1">                   
                      {file.experience.map((exp, index) => {
                        let expSplit = exp.split(' | ');
                        let experience = "";
                        if (expSplit[5] == "" && expSplit[6] == "") {
                          experience = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]})`
                        } else {
                          experience = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]} to ${expSplit[5]}-${expSplit[6]})`
                        }
                        return (<li key={index}>{experience}</li>);
                      })}
                    </ul>
                  </div>

                  <div className="mt-2 text-sm">
                  <b>Additional information: </b>
                   <p className="pl-5 pt-1">{file.additional_info}</p>
                  </div>
                </>
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: file.content }} 
                className="text-sm pt-1 leading-relaxed"
              />
            )}
          </div>
        </div>
    </div>
  )};