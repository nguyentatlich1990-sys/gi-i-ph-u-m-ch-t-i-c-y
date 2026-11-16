import React, { useState, useEffect } from 'react';
import { Cpu, Droplets, Zap, Activity, ToggleRight, Sprout, ArrowRight, Settings2, Info } from 'lucide-react';

const componentsData = {
  sensor: {
    id: 'sensor', name: 'Cảm biến độ ẩm đất', icon: <Activity size={40} />, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500',
    description: 'Đo lường lượng nước trong đất. Trả về tín hiệu điện đưa về mạch điều khiển trung tâm.', spec: 'Điện áp: 3.3V - 5V | Đầu ra: Analog/Digital'
  },
  controller: {
    id: 'controller', name: 'Mạch điều khiển', icon: <Cpu size={40} />, color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500',
    description: 'Bộ脑 hệ thống. Nhận tín hiệu từ cảm biến, đối chiếu với Ngưỡng độ ẩm để ra lệnh cho Rơ-le.', spec: 'Lập trình: C++/MakeCode'
  },
  relay: {
    id: 'relay', name: 'Module Rơ-le', icon: <ToggleRight size={40} />, color: 'text-purple-500', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500',
    description: 'Công tắc điện tử. Dùng dòng điện nhỏ để đóng/ngắt mạch điện lớn (máy bơm).', spec: 'Tín hiệu kích: 5V | Chịu tải: 220V/10A'
  },
  pump: {
    id: 'pump', name: 'Máy Bơm Nước', icon: <Droplets size={40} />, color: 'text-cyan-500', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500',
    description: 'Động cơ hút và đẩy nước khi Rơ-le đóng mạch cấp điện.', spec: 'Điện áp: 3V - 6V DC'
  },
  power: {
    id: 'power', name: 'Nguồn Điện', icon: <Zap size={40} />, color: 'text-red-500', bgColor: 'bg-red-500/20', borderColor: 'border-red-500',
    description: 'Cung cấp năng lượng. Mạch điều khiển dùng 5V, máy bơm đi qua rơ-le.', spec: 'Đầu ra: 5V DC / 2A'
  }
};

function App() {
  const [moisture, setMoisture] = useState(60);
  const [threshold, setThreshold] = useState(40);
  const [activeInfo, setActiveInfo] = useState(componentsData.controller);
  const [isPumping, setIsPumping] = useState(false);

  useEffect(() => {
    if (moisture < threshold) setIsPumping(true);
    else setIsPumping(false);
  }, [moisture, threshold]);

  useEffect(() => {
    let timer;
    if (isPumping && moisture < 100) {
      timer = setInterval(() => { setMoisture(prev => Math.min(prev + 1, 100)); }, 200);
    }
    return () => clearInterval(timer);
  }, [isPumping, moisture]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-2 flex items-center justify-center gap-3">
          <Settings2 size={36} /> GIẢI PHẪU MẠCH TƯỚI CÂY THÔNG MINH
        </h1>
        <p className="text-slate-400">Chạm vào từng linh kiện để xem chi tiết. Kéo thanh trượt để thử nghiệm.</p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold text-slate-300 mb-8 border-b border-slate-700 pb-2">Sơ đồ luân chuyển tín hiệu</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10">
            <CircuitNode data={componentsData.sensor} isActive={activeInfo.id === 'sensor'} onClick={() => setActiveInfo(componentsData.sensor)} isTriggered={!isPumping} />
            <ArrowRight className={`hidden md:block ${!isPumping ? 'text-yellow-500 animate-pulse' : 'text-slate-600'}`} size={32} />
            <CircuitNode data={componentsData.controller} isActive={activeInfo.id === 'controller'} onClick={() => setActiveInfo(componentsData.controller)} isTriggered={true} />
            <ArrowRight className={`hidden md:block ${isPumping ? 'text-blue-500 animate-pulse' : 'text-slate-600'}`} size={32} />
            <CircuitNode data={componentsData.relay} isActive={activeInfo.id === 'relay'} onClick={() => setActiveInfo(componentsData.relay)} isTriggered={isPumping} />
            <ArrowRight className={`hidden md:block ${isPumping ? 'text-purple-500 animate-pulse' : 'text-slate-600'}`} size={32} />
            <CircuitNode data={componentsData.pump} isActive={activeInfo.id === 'pump'} onClick={() => setActiveInfo(componentsData.pump)} isTriggered={isPumping} />
          </div>

          <div className="mt-16 flex items-center justify-between bg-slate-900/50 p-6 rounded-xl border border-slate-700">
            <div className="flex flex-col items-center">
              <CircuitNode data={componentsData.power} isActive={activeInfo.id === 'power'} onClick={() => setActiveInfo(componentsData.power)} isTriggered={true} />
            </div>
            <div className="flex flex-col items-center flex-1 mx-8 relative">
              {isPumping && (
                <div className="absolute -top-12 flex space-x-2 text-cyan-400">
                  <Droplets className="animate-bounce" size={24} />
                  <Droplets className="animate-bounce delay-100" size={24} />
                  <Droplets className="animate-bounce delay-200" size={24} />
                </div>
              )}
              <Sprout size={64} className={`${isPumping ? 'text-green-400' : (moisture < 30 ? 'text-orange-700' : 'text-green-700')} transition-colors duration-1000`} />
              <div className="w-full h-4 bg-amber-900/40 rounded-full mt-4 overflow-hidden relative">
                 <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${moisture}%`, opacity: moisture / 100 }}></div>
              </div>
              <span className="text-sm text-slate-400 mt-2">Đất trồng (Độ ẩm: {moisture}%)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl h-64">
            <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2"><Info size={20} /> Phân tích linh kiện</h2>
            <div className="animate-fadeIn">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${activeInfo.bgColor} ${activeInfo.color}`}>{activeInfo.icon}</div>
              <h3 className={`text-xl font-bold mb-2 ${activeInfo.color}`}>{activeInfo.name}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{activeInfo.description}</p>
              <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-400 border border-slate-700">{activeInfo.spec}</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex-1">
            <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2"><Settings2 size={20} /> Giả lập môi trường</h2>
            <div className="mb-8">
              <label className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Độ ẩm đất hiện tại</span><span className="font-bold text-blue-400">{moisture}%</span>
              </label>
              <input type="range" min="0" max="100" value={moisture} onChange={(e) => setMoisture(Number(e.target.value))} className="w-full accent-blue-500 cursor-pointer" />
            </div>
            <div className="mb-6 bg-slate-900 p-4 rounded-xl border border-slate-700">
              <label className="flex justify-between text-sm text-slate-300 mb-2"><span>Ngưỡng kích hoạt tưới (NẾU &lt; {threshold}%)</span></label>
              <input type="range" min="10" max="90" step="10" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer" />
            </div>
            <div className={`p-4 rounded-xl text-center font-bold border-2 transition-all duration-300 ${isPumping ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
              {isPumping ? "TRẠNG THÁI: ĐANG BƠM NƯỚC" : "TRẠNG THÁI: CHỜ (ĐỦ NƯỚC)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CircuitNode({ data, isActive, onClick, isTriggered }) {
  return (
    <button onClick={onClick} className={`relative group flex flex-col items-center transition-all duration-300 hover:scale-105`}>
      {isTriggered && <div className={`absolute inset-0 rounded-2xl ${data.bgColor} animate-ping opacity-75`}></div>}
      <div className={`relative z-10 p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${isActive ? `${data.bgColor} ${data.borderColor}` : 'bg-slate-900 border-slate-700'} ${isTriggered ? `shadow-[0_0_20px_var(--tw-shadow-color)] shadow-${data.color.split('-')[1]}-500/50` : ''}`}>
        <div className={`${data.color} ${isTriggered ? 'animate-pulse' : 'opacity-80 group-hover:opacity-100'}`}>{data.icon}</div>
      </div>
      <span className={`mt-3 text-xs font-bold text-center w-24 leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>{data.name}</span>
    </button>
  );
}

export default App;