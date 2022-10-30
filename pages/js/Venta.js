//host
//var host = "http://192.168.10.30/inventario/Inventario/api/";

var host = "https://localhost:7042/api/";

//llamada al metodo para mostrar los datos
getData();

getClientes();

GetProductos();
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
function GetProductos(){
    fetch(`${host}Productos/GetProductos`).then(res => res.json())
        .then(data => {
            console.log(data);
            
            for (let d of data) {
                var opc  = '<option value="'+ d.id+'">'+d.descripcion+'</option>'
                $('#idProducto').append(opc)
            }
        });
}

var Vehiculos = [];
function getClientes(){
    fetch(`${host}Clientes/GetClientes`).then(res => res.json())
        .then(data => {
            console.log(data);
            
            for (let d of data) {
                var opc  = '<option value="'+ d.id+'">'+d.nombre+'</option>'
                $('#clienteId').append(opc)
            }
        });
}

//variable utilizada para acceder al formulario 
var form = document.getElementById('frmvehiculo');


/*metodo utilizado para obtener los vehiculos almacenados */
function getData() {
    var table = document.getElementById('tbVehiculos')
    fetch(`${host}Productos/GetProductos`).then(res => res.json())
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
                    <td>${d.codigo}</td>
                    <td>${d.descripcion}</td>
                    <td>${d.costo}</td>
                    <td>${d.precio}</td>
                    <td>${d.cantidad}</td>
                    <td>${d.categoria}</td>
                    <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                        <a onClick="Editar(${i})" class="dropdown-item" href="javascript:void(0);"
                            ><i class="bx bx-edit-alt me-1"></i> Edit</a
                        >
                        <a onclick="MdEliminar(${d.id})" class="dropdown-item" href="javascript:void(0);"
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

    var method = "POST";
    var url = `${host}Ventas/AddVenta`
   // alert(data.id)
    
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
        console.log(response.ok)
        if (response.ok ===true || response.status !== 404) {
            getData();
            $('#modalCenter').modal('hide');
            $('#hd').text("Success!")
            $('.toast-body').text("Datos agregados exitosamente!")
            $('#showToastPlacement').click();
            $('#id').val(0)
            return response.json;
        } else {
            $('#modalCenter').modal('hide');
            $('#hd').text("Error!")
            $('.toast-body').text("ha ocurrido un error")
            $('#showToastPlacement').click();
        }
    })

        .catch((error) => {
            console.error('Error:', error);
        });
}


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
        console.log(response.ok)
        if (response.ok ===true || response.status !== 404) {
            getData();
            $('#modalCenter').modal('hide');
            $('#hd').text("Success!")
            $('.toast-body').text("Datos agregados exitosamente!")
            $('#showToastPlacement').click();
            $('#id').val(0)
            return response.json;
        } else {
            $('#modalCenter').modal('hide');
            $('#hd').text("Error!")
            $('.toast-body').text("ha ocurrido un error")
            $('#showToastPlacement').click();
        }
    })

        .catch((error) => {
            console.error('Error:', error);
        });
}



/* 
    limpiar formulario
*/
function limpiarForm() {
    for (var clave in Vehiculos[0]) {
        $('#' + clave).val('');
    }
    $('#garaje').show();
    $('#id').val(0);
    $('#idvehiculo').val(0);
}


