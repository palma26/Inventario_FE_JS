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

//variable utilizada para almacenar los Vehiculos 
var Vehiculos = [];

//variable utilizada para acceder al formulario 
var form = document.getElementById('frmvehiculo');


/*metodo utilizado para obtener los deptos almacenados */
function getData() {
    var table = document.getElementById('tbVehiculos')
    fetch(`${host}/api/Vehiculos`).then(res => res.json())
        .then(data => {
            console.log(data);
            var i = 0;
            var e = 0;
            var count = 1;
            Vehiculos = data;
            table.innerHTML = ""
            for (let d of data) {
                table.innerHTML += `
                <tr>
                    <td>${d.matricula}</td>
                    <td>${d.marca}</td>
                    <td>${d.color}</td>
                    <td>${d.precio}</td>
                    <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                        <a onClick="Editar(${i})" class="dropdown-item" href="javascript:void(0);"
                            ><i class="bx bx-edit-alt me-1"></i> Edit</a
                        >
                        <a onclick="MdEliminar(${d.idvehiculo})" class="dropdown-item" href="javascript:void(0);"
                            ><i class="bx bx-trash me-1"></i> Delete</a
                        >
                        </div>
                    </div>
                    </td>
                </tr>               
                `
                count++;
                i++;
            }
        });
}


/* toma y envia los datos del formulario */
form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = $(this).serializeFormJSON();
    data.idvehiculo = parseInt(data.idvehiculo);

    var method = "POST";
    var url = `${host}/api/Vehiculos`
    if (data.idvehiculo > 0) {
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
            getData();
            $('#modalCenter').modal('hide');
            $('#hd').text("Success!")
            $('.toast-body').text("Datos agregados exitosamente!")
            $('#showToastPlacement').click();
            return response.json;
        } else {
            $('#hd').text("Error!")
            $('.toast-body').text("ha ocurrido un error, comuniquese con el administrador!")
        }
    })
        .then(function (data) {
            console.log(data);
        });
}

/* 
    -Metodo utilizado para enviar los datos al formulario
*/
function Editar(i) {
    for (var clave in Vehiculos[i]) {
        $('#' + clave).val(Vehiculos[i][clave]);
        console.log(clave + ' ' + Vehiculos[i][clave]);
    }
    $('#modalCenter').modal('show');

}

/* 
    eliminar 
*/
function MdEliminar(id){
    $('#mdEliminar').modal('show')
    $('#idvehiculoE').val(id);
}


/* 
    limpiar formulario
*/
function limpiarForm(){
    for (var clave in Vehiculos[0]) {
        $('#' + clave).val('');
    }
    $('#idvehiculo').val(0);
}


function Eliminar(){
    var id = $('#idvehiculoE').val();
    fetch(`${host}/api/Vehiculos/${id}`, {
        method: 'DELETE',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        console.log(response);
        if (response.ok) {
            getData();
            $('#mdEliminar').modal('hide');
            $('#hd').text("Success!")
            $('.toast-body').text("Datos agregados exitosamente!")
            $('#showToastPlacement').click();
            return response.json;
        } else {
            $('#hd').text("Error!")
            $('.toast-body').text("ha ocurrido un error, comuniquese con el administrador!")
        }
    })
        .then(function (data) {
            console.log(data);
        });
}