//host
//var host = "http://192.168.10.30/inventario/Inventario/api/";

var host = "https://localhost:7042/api/";

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

/*metodo utilizado para obtener los vehiculos almacenados */
function getData() {
    var table = document.getElementById('tbVehiculos')
    fetch(`${host}Ventas/NotasCredito`).then(res => res.json())
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
                    <td>${d.descripcion}</td>
                    <td>${d.precio}</td>
                    <td>${d.cantidad}</td>
                    <td>${d.producto}</td>
                    <td>${d.cliente}</td>
                    <td>
                    
                    </td>
                </tr>               
                `
                count++;
                i++;
            }
        });
}


