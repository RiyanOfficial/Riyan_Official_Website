// ===== Loading screen (5 detik) =====
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  setTimeout(() => {
    loading.style.transition = "opacity 0.7s ease";
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 700);
  }, 5000);
});

// ===== Navigation dengan transisi halus =====
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function showPageById(id) {
  pages.forEach(p => {
    if (p.id === id) {
      p.classList.add("show");
    } else {
      p.classList.remove("show");
    }
  });
  navItems.forEach(n => n.classList.toggle("active", n.dataset.target === id));
  document.querySelector("main.app-main").scrollTop = 0;
}

navItems.forEach(n =>
  n.addEventListener("click", () => showPageById(n.dataset.target))
);

showPageById("page-dashboard");

// ===== Copy tombol payment =====
document.addEventListener("click", e => {
  const target = e.target.closest(".copy-btn");
  if (target) {
    const text = target.dataset.copy;
    navigator.clipboard.writeText(text);
    showToast(`Disalin: ${text}`);
  }

  const buyBtn = e.target.closest(".buy-btn");
  if (buyBtn) {
    const wa = buyBtn.dataset.wh || "6285715989482";
    const item = encodeURIComponent(buyBtn.dataset.item || "Produk");
    window.open(`https://wa.me/${wa}?text=Halo%20Riyan,%20saya%20ingin%20beli%20${item}`, "_blank");
  }
});

// ===== Tombol Channel =====
document.getElementById("btn-telegram")?.addEventListener("click", e => {
  e.preventDefault();
  window.open("https://t.me/riyanofficial08", "_blank");
});

document.getElementById("btn-wa-channel")?.addEventListener("click", e => {
  e.preventDefault();
  window.open("https://whatsapp.com/channel/0029VbBadVw6GcGHe3EaC514", "_blank");
});

// ===== Toast popup =====
function showToast(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  Object.assign(toast.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "90px",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    zIndex: "9999",
    boxShadow: "0 6px 18px rgba(0,0,0,0.5)"
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

// ===== Riyan AI (demo Gemini) =====
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chatContainer.appendChild(userMsg);
  userInput.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.textContent = "Riyan AI sedang mengetik...";
  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const API_KEY = "AIzaSyCsuyULDyAaDRMGeNwbA8jIJYksUF46Shg";
    if (!API_KEY || API_KEY.includes("MASUKKAN_API_KEY")) {
      await new Promise(r => setTimeout(r, 400));
      typing.remove();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "✳️ (Demo) Masukkan API_KEY Gemini di script.js untuk jawaban asli.";
      chatContainer.appendChild(botMsg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return;
    }

    const endpoint = `https://api.siputzx.my.id/api/ai/gemini?apikey=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text }] }] };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    typing.remove();

    let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gagal ambil jawaban dari API.";
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.textContent = reply;
    chatContainer.appendChild(botMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (err) {
    typing.remove();
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.textContent = "⚠️ Terjadi kesalahan koneksi.";
    chatContainer.appendChild(botMsg);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});