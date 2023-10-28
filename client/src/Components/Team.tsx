import React from 'react'

export default function Team() {
  return (
    <div style={{ position: "fixed", top: "120px", width: "100vw", height: "calc(100vh - 120px)", overflow: "scroll" }}>
      <div style={{padding: "30px", width: "100vw", height: "fit-content" }}>
        <div style={{ textAlign: "center", fontSize: "25px" }} className='event-normal'>Tech Team</div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/shank03.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Shashank Verma</p>
            </div>
          </div>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/sanskaromar.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Sanskar Omar</p>
            </div>
          </div>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/priyavkaneria.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Priyav K Kaneria</p>
            </div>
          </div>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/adityaa22.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Aditya Srivastava</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-2">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/32bitdev.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Subrat Pandey</p>
            </div>
          </div>
          <div style={{ width: "fit-content" }} className="container-team podium-team">
            <div className="podium__item-team">
              <div className="podium__rank team-individual">
                <div className="loader1-team-2">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className='image-cropper'>
                  <img src={`https://github.com/meisabhishekpatel.png`} alt="" />
                </div>
              </div>
              <p className="podium__city-team">Abhishek Patel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
