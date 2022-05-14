//host
var host = "https://localhost:44308";


//llamada al metodo para mostrar los datos
getData();

//convertir formulario a json
(function ($) {
    //toma los datos del formulario y los convierte a tipo JSON
    $.fn.serializeFormJSON = function () {
        var objeto = {};
        var formulario = this.serializeArray();
        /* recorre los datos del formulario y los separa por clave y valor */
        $.each(formulario, function () {
            if (objeto[this.name]) {
                if (!objeto[this.name].push) {
                    objeto[this.name] = [objeto[this.name]];
                }
                objeto[this.name].push(this.value || '');
            } else {
                objeto[this.name] = this.value || '';
            }
        });
        return objeto;
    };
})(jQuery);

//variable utilizada para almacenar los deptos 
var deptos = [];

//variable utilizada para acceder al formulario 
var form = document.getElementById('frmGaraje');


/* define la variable que almacena el id de nuestro panel donde se 
*mostraran los datos almacenados */



/*metodo utilizado para obtener los deptos almacenados */
function getData() {
    var table = document.getElementById('tbGarajes')
    fetch(`${host}/api/garajes`).then(res => res.json())
        .then(data => {
            console.log(data);
            var i = 0;
            var e = 0;
            var count = 1;
            deptos = data;
            table.innerHTML = ""
            for (let d of data) {
                table.innerHTML += `
                <tr>
                    <td>${count}</td>
                    <td>${d.descripcion}</td>
                    <td><span class="badge bg-label-primary me-1">${d.estado}</span></td>
                    <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);"
                            ><i class="bx bx-edit-alt me-1"></i> Edit</a
                        >
                        <a class="dropdown-item" href="javascript:void(0);"
                            ><i class="bx bx-trash me-1"></i> Delete</a
                        >
                        </div>
                    </div>
                    </td>
                </tr>               
                `
            }
        });
}


/* toma y envia los datos del formulario */
form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = $(this).serializeFormJSON();
    data.idgaraje = parseInt(data.idgaraje);

    var method = "POST";
    var url = `${host}/api/garajes`
    if (data.idgaraje > 0) {
        method = "PUT";

    }

    action(url, data, method);
});


/*metodo utilizado para crear un nuevo depto */
function action(urlC, data, metodo) {
    var mensaje = "";
    //deshabilitar boton
    //ejecuta el metodo 
    fetch(urlC, {
        method: metodo,
        body: JSON.stringify(data),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        console.log(response);
        if (response.ok) {
           
            return response.json;
        } else {
            alert("No se pudo insertar");
        }
    })
        .then(function (data) {
            console.log(data);
        });
}

function getEmpresas() {
    fetch(urlEmpresas).then(res => res.json())
        .then(data => {
            empresas.innerHTML = `
             <option value="0">Seleccionar</option>
        `
            for (let d of data) {
                empresas.innerHTML += `
                <option value="${d.idempresa}">${d.nombre}</option>
            `
            }
        });
}

/*metodo utilizado para mostrar la modal que contiene el formulario 
para crear nuevos deptos */
function showModal() {
    $('#frmdepto').trigger('reset');
    $('#Mddepto').modal('show');
}

/*metodo utilizado para mostrar la modal para eliminar un depto */
function showModalDelete(id) {
    $('#ide').val(id);
    $('#MdDeletedepto').modal('show');
}

/*metodo utilizado para enviar los datos al formulario para actualizar el depto */
function sendDataForm(i) {
    $('#Mddepto').modal('show');
    for (var key in deptos[i]) {
        $('#' + key).val(deptos[i][key]);
    }
}

/*metodo utilizado para eliminar un depto */
function eliminar() {
    fetch(urlE + $('#ide').val(), {
        method: 'PUT',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        if (response.ok) {
            getData();
            $('#msj').text("Datos eliminados exitosamente");
            $('.toast').toast('show');
            return response.json;
        } else {
            alert("No se pudo eliminar");
        }
    })
        .then(function (data) {
            console.log(data);
        });
}

/*metodo utilizado para realizar una busqueda */
$('#search').keyup(function () {
    console.log($(this).val());
    fetch(urlsearch, {
        method: 'POST',
        body: JSON.stringify({ nombre: $(this).val() }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
            var i = 0;
            var e = 0;
            var count = 1;
            contenido.innerHTML = ""
            for (let d of data) {
                contenido.innerHTML += `
                <div class="col-12 col-md-6  col-lg-4 p-2">
                    <div class="card bg-transparent">
                        <div class="card-body  ${colors[i].color} text-left text-white shadow">
                            <div class="col-12"><br>
                                <h6><strong>${count}) ${d.descripcion}</strong></h6>
                                <p><small>Departamento Laboral</small></p>
                                <span hidden id="iddeptot" hidden>${d.iddepto}</span>
                            </div>
                            <div class="col-12 text-right">
                                <button onclick="showModalDelete(${d.iddepto})" class="btn ${bgbuttons[i].color1}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button onclick="sendDataForm(${e})" class="btn ${bgbuttons[i].color2}">
                                <i class="fas fa-pen"></i>
                                </button>
                            </div>
                        </div>       
                    </div>
                </div>
            `
                console.log(colors[i].color);
                if (i == 2) { i = 0; } else {
                    i++;
                }
                e++;
                count++;
            }

            contenido.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 p-2">
                <div class="card shadow">
                    <div onclick="showModal()" class="card-body btn btn-light  shadow" style="cursor:pointer">
                        <div class="col-12">
                            <br>
                            <h1>
                            +
                            </h1>
                            <p>&nbsp;</p>
                        </div>
                    </div>      
                </div>
            </div>
        `

            $('#Mddepto').modal('hide');
            $('#MdDeletedepto').modal('hide');
        });
});

