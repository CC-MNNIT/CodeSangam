// import React from 'react'

// export default function Team() {
//   const funx = (e: any) => {
//     // const podiumItem = Array.from(document.getElementsByClassName('container-team'));
//     // for (const eachItem of podiumItem) {
//     //   const item = eachItem as HTMLInputElement | null;
//     //   if (item != null) {
//     //     let topDistance = item.getBoundingClientRect().top;
//     //     topDistance = 0.5 + topDistance / 100;
//     //     item.style.opacity = "" + topDistance;
//     //   }

//   }
//   return (
//     <div onScroll={(e) => { funx(e); }} style={{ position: "fixed", top: "120px", width: "100vw", height: "calc(100vh - 120px)", overflow: "scroll" }}>
//       <div style={{ paddingTop: "0px", padding: "30px", marginTop: "0", width: "100vw", height: "130vh" }}>
//         <div style={{ textAlign: "center" }} className='card'>TECH TEAM</div>
//         <div className='four-year-div' style={{}}>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-1">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/shank03.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Shashank Verma</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/shank03" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="https://twitter.com/shank_03" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/shank03" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-1">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/sanskaromar.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Sanskar Omar</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/sanskaromar" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="https://twitter.com/SanskarOmar_" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/sanskaromar-/" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-1">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/priyavkaneria.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Priyav K Kaneria</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/PriyavKaneria" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="https://twitter.com/priyav_kaneria" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/priyavkaneria/" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-1">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/adityaa22.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Aditya Srivastava</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/adityaa22" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="https://twitter.com" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/adityasrivastava1407/" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="three-year-div" style={{}}>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-2">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/32bitdev.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Subrat Pandey</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/32bitdev" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="#" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/subrat2839/" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div style={{}} className="container-team podium-team">
//             <div className="podium__item-team">
//               <div className="podium__rank team-individual">
//                 <div className="loader1-team-2">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <div className='image-cropper-contri'>
//                   <img src={`https://github.com/meisabhishekpatel.png`} alt="" />
//                 </div>
//               </div>
//               <p className="card podium__city-team">Abhishek Patel</p>
//               <div className="flex justify-center space-x-4 text-gray-500">
//                 <a href="https://github.com/meisabhishekpatel" target="_blank" rel="noreferrer">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792">
//                     <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
//                   </svg>
//                 </a>
//                 <a href="#" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
//                   </path>
//                 </svg>
//                 </a>
//                 <a href="https://www.linkedin.com/in/meabhishekpatel/" target="_blank" rel="noreferrer"><svg width="30" height="30" className="social-links text-xl transition-colors duration-200 hover:text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
//                   </path>
//                 </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { gsap } from 'gsap';

export default function Team() {
  const [selectedYear, setSelectedYear] = useState('all');
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const filteredMembers = selectedYear === 'all'
    ? teamMembers
    : teamMembers.filter(member => member.year === selectedYear);

  // Smooth scroll animation using GSAP
  useEffect(() => {
    gsap.to(containerRef.current, {
      scrollTop: 0,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, [selectedYear]);

  // Dropdown animation with GSAP
  useEffect(() => {
    gsap.fromTo(dropdownRef.current, { opacity: 0, scale: 0.8 }, {
      opacity: 1, 
      scale: 1, 
      duration: 0.8, 
      ease: 'power3.out',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: "120px", width: "100vw", height: "calc(100vh - 120px)", overflowY: "scroll" }}
    >
      <div style={{ paddingTop: "0px", padding: "30px", marginTop: "0", width: "100vw", height: "130vh" }}>
        <div style={{ textAlign: "center" }} className='card'>
          TECH TEAM
        </div>

        {/* Dropdown for filtering by year */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <label className='text-white' htmlFor="year-filter" style={{ marginRight: '10px' }}>Filter by Year: </label>
          <select
            ref={dropdownRef}
            id="year-filter"
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#2d2d2d',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => gsap.to(dropdownRef.current, { backgroundColor: '#4a4a4a', duration: 0.3 })}
            onMouseLeave={() => gsap.to(dropdownRef.current, { backgroundColor: '#2d2d2d', duration: 0.3 })}
          >
            <option value="all">All</option>
            <option value="final year">Final Year</option>
            <option value="third year">Third Year</option>
          </select>
        </div>

        <div className='four-year-div'>
          {filteredMembers.map((member, index) => (
            <div className="container-team podium-team" key={index}>
              <div className="podium__item-team">
                <div className="podium__rank team-individual">
                  <div className="loader1-team-1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className='image-cropper-contri'>
                    <img src={member.image} alt={member.name} />
                  </div>
                </div>
                <p className="card podium__city-team">{member.name}</p>
                <div className="flex justify-center space-x-4 text-gray-500">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noreferrer">
                      <FaGithub className="h-6 w-6" aria-hidden="true" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noreferrer">
                      <FaTwitter className="h-6 w-6" aria-hidden="true" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer">
                      <FaLinkedin className="h-6 w-6" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




const teamMembers = [
  {
    name: 'Shashank Verma',
    github: 'https://github.com/shank03',
    twitter: 'https://twitter.com/shank_03',
    linkedin: 'https://www.linkedin.com/in/shank03',
    image: 'https://github.com/shank03.png',
    year: 'final year'
  },
  {
    name: 'Sanskar Omar',
    github: 'https://github.com/sanskaromar',
    twitter: 'https://twitter.com/SanskarOmar_',
    linkedin: 'https://www.linkedin.com/in/sanskaromar-/',
    image: 'https://github.com/sanskaromar.png',
    year: 'final year',
  },
  {
    name: 'Priyav K Kaneria',
    github: 'https://github.com/PriyavKaneria',
    twitter: 'https://twitter.com/priyav_kaneria',
    linkedin: 'https://www.linkedin.com/in/priyavkaneria/',
    image: 'https://github.com/priyavkaneria.png',
    year: 'final year',
  },
  {
    name: 'Aditya Srivastava',
    github: 'https://github.com/adityaa22',
    twitter: 'https://twitter.com',
    linkedin: 'https://www.linkedin.com/in/adityasrivastava1407/',
    image: 'https://github.com/adityaa22.png',
    year: 'third year',
  },
  {
    name: 'Subrat Pandey',
    github: 'https://github.com/32bitdev',
    twitter: 'https://twitter.com',
    linkedin: 'https://www.linkedin.com/in/subrat2839/',
    image: 'https://github.com/32bitdev.png',
    year: 'third year',
  },
  {
    name: 'Abhishek Patel',
    github: 'https://github.com/meisabhishekpatel',
    twitter: 'https://twitter.com',
    linkedin: 'https://www.linkedin.com/in/meabhishekpatel/',
    image: 'https://github.com/meisabhishekpatel.png',
    year: 'third year',
  },
  // Add more team members here
];