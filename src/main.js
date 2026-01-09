const API_URL = import.meta.env.VITE_API_URL;
let usuarioLogueado = null;

// VISTAS
const vistaLogin = document.getElementById("vistaLogin");
const vistaDashboard = document.getElementById("vistaDashboard");
const vistaPerfil = document.getElementById("vistaPerfil");
const vistaEstudiantes = document.getElementById("vistaEstudiantes");
const vistaMaterias = document.getElementById("vistaMaterias");
const vistaNotas = document.getElementById("vistaNotas");

// BOTONES
const btnPerfil = document.getElementById("btnPerfil");
const btnEstudiantes = document.getElementById("btnEstudiantes");
const btnMaterias = document.getElementById("btnMaterias");
const btnNotas = document.getElementById("btnNotas");

// LOGIN
document.getElementById("formLogin").addEventListener("submit", async e => {
  e.preventDefault();

  const cedula = loginCedula.value;
  const clave = loginClave.value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cedula, clave })
  });

  const data = await res.json();
  if (!res.ok) return loginError.textContent = data.msg;

  usuarioLogueado = data.usuario;
  vistaLogin.classList.add("d-none");
  vistaDashboard.classList.remove("d-none");

  perfilNombre.textContent = usuarioLogueado.nombre;
  perfilCedula.textContent = usuarioLogueado.cedula;
  perfilRol.textContent = usuarioLogueado.rol;

  if (usuarioLogueado.rol === "estudiante") {
    btnEstudiantes.classList.add("d-none");
    btnMaterias.classList.add("d-none");
    btnNotas.click();
    cargarMisNotas();
    document.getElementById("formNotasDocente").classList.add("d-none");
  } else {
    cargarEstudiantes();
    cargarMaterias();
  }
});

// NAVEGACIÓN
btnPerfil.onclick = () => mostrar("perfil");
btnEstudiantes.onclick = () => mostrar("estudiantes");
btnMaterias.onclick = () => mostrar("materias");
btnNotas.onclick = () => mostrar("notas");

function mostrar(v) {
  [vistaPerfil, vistaEstudiantes, vistaMaterias, vistaNotas]
    .forEach(x => x.classList.add("d-none"));

  if (v === "perfil") vistaPerfil.classList.remove("d-none");
  if (v === "estudiantes") vistaEstudiantes.classList.remove("d-none");
  if (v === "materias") vistaMaterias.classList.remove("d-none");
  if (v === "notas") vistaNotas.classList.remove("d-none");
}

// CARGAS
async function cargarEstudiantes() {
  const res = await fetch(`${API_URL}/estudiantes`);
  const data = await res.json();
  tablaEstudiantes.innerHTML = data.map(e =>
    `<tr><td>${e.id}</td><td>${e.nombre}</td></tr>`
  ).join("");
}

async function cargarMaterias() {
  const res = await fetch(`${API_URL}/materia`);
  const data = await res.json();
  tablaMaterias.innerHTML = data.map(m =>
    `<tr><td>${m.codigo}</td><td>${m.nombre}</td></tr>`
  ).join("");
}

async function cargarMisNotas() {
  const res = await fetch(`${API_URL}/mis-notas/${usuarioLogueado.id}`);
  const data = await res.json();
  tablaNotasEstudiante.innerHTML = data.map(n =>
    `<tr><td>${n.materia}</td><td>${n.nota}</td></tr>`
  ).join("");
}

// GUARDAR NOTA (DOCENTE)
btnGuardarNota.onclick = async () => {
  if (usuarioLogueado.rol !== "docente") return;

  await fetch(`${API_URL}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      estudiante_id: notaEstudiante.value,
      materia_id: notaMateria.value,
      usuario_id: usuarioLogueado.id,
      nota: notaValor.value
    })
  });
};

