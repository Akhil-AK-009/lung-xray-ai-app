import { useState } from "react"
import axios from "axios"

function App() {

  const [step, setStep] = useState(1)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [predictions, setPredictions] = useState(null)

  const [gradcam, setGradcam] = useState(null)

  const [loading, setLoading] = useState(false)

  const diseases = [
    {
      name: "Atelectasis",
      desc: "Partial collapse of the lung which may reduce oxygen flow and cause breathing difficulty."
    },
    {
      name: "Cardiomegaly",
      desc: "Enlargement of the heart that may indicate cardiovascular problems."
    },
    {
      name: "Consolidation",
      desc: "Fluid-filled lung regions commonly associated with pneumonia."
    },
    {
      name: "Edema",
      desc: "Fluid accumulation inside the lungs affecting breathing."
    },
    {
      name: "Pleural Effusion",
      desc: "Fluid buildup around the lungs compressing breathing space."
    }
  ]

  const getRisk = (score) => {

    if (score >= 70) return "High Risk"

    if (score >= 30) return "Moderate Risk"

    return "Low Risk"
  }

  const getTopPrediction = () => {

    return Object.entries(predictions)
      .sort((a, b) => b[1] - a[1])[0]
  }

  const handleUpload = async () => {

    if (!file) return

    const formData = new FormData()

    formData.append("file", file)

    try {

      setLoading(true)

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      )

      setPredictions(response.data.predictions)

      setGradcam(response.data.gradcam)

      setStep(3)

    } catch (error) {

      console.error(error)

      alert("Prediction failed")

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* STEP 1 */}

      {step === 1 && (

        <div>

          <div className="bg-black text-white py-20 px-6">

            <div className="max-w-5xl mx-auto text-center">

              <h1 className="text-5xl font-bold mb-6">
                Chest X-ray AI Screening
              </h1>

              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-8">
                AI-powered chest X-ray analysis system designed for
                early screening of common lung abnormalities using
                deep learning and explainable AI.
              </p>

            </div>

          </div>

          <div className="max-w-6xl mx-auto py-14 px-6">

            <div className="bg-white rounded-2xl shadow p-8 mb-12">

              <h2 className="text-3xl font-bold mb-4">
                About This System
              </h2>

              <p className="text-gray-700 leading-8">
                This web application uses an EfficientNet-B0 + CBAM deep learning model
                trained on chest X-ray images to screen for multiple thoracic diseases.
                The system also provides Explainable AI visualization using Grad-CAM
                to highlight regions influencing predictions.
              </p>

              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-xl text-sm text-yellow-900">
                This application is intended for educational and research purposes only.
                It should not replace professional medical diagnosis.
              </div>

            </div>

            <h2 className="text-3xl font-bold mb-8 text-center">
              Detectable Conditions
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

              {diseases.map((disease) => (

                <div
                  key={disease.name}
                  className="bg-white p-6 rounded-2xl shadow"
                >

                  <h3 className="text-xl font-semibold mb-3">
                    {disease.name}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {disease.desc}
                  </p>

                </div>

              ))}

            </div>

            <div className="text-center">

              <button
                onClick={() => setStep(2)}
                className="bg-black text-white px-10 py-4 rounded-2xl text-lg hover:opacity-90"
              >
                Start Screening
              </button>

            </div>

          </div>

        </div>

      )}


      {/* STEP 2 */}

      {step === 2 && (

        <div className="max-w-3xl mx-auto py-20 px-6">

          <div className="bg-white rounded-2xl shadow p-10">

            <h2 className="text-4xl font-bold text-center mb-6">
              Upload Chest X-ray
            </h2>

            <p className="text-center text-gray-600 mb-8">
              Upload a chest X-ray image for AI-based analysis.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {

                setFile(e.target.files[0])

                setPreview(
                  URL.createObjectURL(e.target.files[0])
                )

              }}
              className="mb-6 block w-full border border-gray-300 rounded-lg p-3"
            />

            {preview && (

              <img
                src={preview}
                alt="Preview"
                className="w-full h-80 object-cover rounded-xl mb-6 border"
              />

            )}

            <button
              onClick={handleUpload}
              className="w-full bg-black text-white px-6 py-4 rounded-xl hover:opacity-90 transition text-lg"
            >

              {loading ? "Analyzing..." : "Analyze X-ray"}

            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 border border-black px-6 py-4 rounded-xl hover:bg-gray-100"
            >
              Back
            </button>

          </div>

        </div>

      )}


      {/* STEP 3 */}

      {step === 3 && (

        <div className="max-w-6xl mx-auto py-14 px-6">

          <div className="bg-white rounded-2xl shadow p-10">

            <h2 className="text-4xl font-bold mb-10">
              AI Analysis Results
            </h2>


            {/* PRIMARY FINDING */}

            <div className="mb-10 bg-black text-white p-8 rounded-2xl">

              <p className="text-gray-300 mb-2">
                Primary AI Finding
              </p>

              <h2 className="text-4xl font-bold mb-3">

                {getTopPrediction()[0]}

              </h2>

              <p className="text-lg">

                {getRisk(getTopPrediction()[1])}

              </p>

            </div>


            {/* PREDICTIONS */}

            <div className="space-y-5 mb-14">

              {Object.entries(predictions).map(([label, score]) => (

                <div
                  key={label}
                  className="bg-gray-100 p-5 rounded-2xl"
                >

                  <div className="flex justify-between items-center mb-3">

                    <div>

                      <h3 className="font-semibold text-lg">
                        {label}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {getRisk(score)}
                      </p>

                    </div>

                    <span className="text-lg font-bold">
                      {score}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-300 rounded-full h-4">

                    <div
                      className="bg-black h-4 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>

                  </div>

                </div>

              ))}

            </div>


            {/* GRADCAM */}

            <h2 className="text-3xl font-bold mb-8">
              Explainable AI (Grad-CAM)
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-10">

              <div>

                <h3 className="font-semibold mb-3">
                  Original X-ray
                </h3>

                <img
                  src={preview}
                  alt="Original"
                  className="rounded-2xl border shadow"
                />

              </div>

              <div>

                <h3 className="font-semibold mb-3">
                  AI Attention Heatmap
                </h3>

                <img
                  src={gradcam}
                  alt="GradCAM"
                  className="rounded-2xl border shadow"
                />

              </div>

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

              <h3 className="text-xl font-semibold mb-4">
                Understanding the Heatmap
              </h3>

              <ul className="space-y-3 text-gray-700 leading-7">

                <li>
                  🔴 Red / Yellow regions indicate higher AI attention.
                </li>

                <li>
                  🟢 Green regions indicate moderate influence.
                </li>

                <li>
                  🔵 Blue regions indicate lower influence.
                </li>

                <li>
                  Highlighted regions do not directly confirm disease.
                  They represent image regions considered important by the AI model.
                </li>

              </ul>

            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-10 w-full bg-black text-white px-6 py-4 rounded-xl hover:opacity-90"
            >
              Analyze Another X-ray
            </button>

          </div>

          <div className="text-center text-gray-500 text-sm py-10 leading-7">

            This application is intended for educational,
            research, and AI demonstration purposes only.
            Clinical decisions should always be made by qualified medical professionals.

          </div>

        </div>

      )}

    </div>

  )
}

export default App