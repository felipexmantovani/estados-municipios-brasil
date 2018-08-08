$(document).ready( function() {
  var selectEstados = $('#estados');
  var selectMunicipios = $('#municipios');

  // get estados
  $.ajax({
    url: 'estados-brasil.json',
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      $('.qtdEstadosBrasil').text(response.length);
      $('<option value="">Selecione um estado...</option>').appendTo(selectEstados);

      response.forEach( function(item) {
        $('<option value="'+item.sigla+'">'+item.nome+'</option>').appendTo(selectEstados);
      });
    },
    error: function() {
      alert('Não foi possível carregar os estados.');
    }
  });
  // get estados

  // municipios
  $.ajax({
    url: 'municipios-brasil.json',
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      $('.qtdMunicipiosBrasil').text(response.length);
      // change estados
      selectEstados.change(function(){
        var estadoSelecionado = $(this).val();
        var nomeEstado = $(this).find('option:selected').text();
        $('.nomeEstado').text(nomeEstado);

        if(estadoSelecionado == ''){
          selectMunicipios.html('').slideUp();
          $('.infos-estado, .bandeira-estado, .infos-municipio').hide();
        } else {
          selectMunicipios.html('').slideDown();
          $('.infos-estado, .bandeira-estado').show();
          $('.bandeira-estado').attr('src', 'images/'+estadoSelecionado.toLowerCase()+'.png').attr('title', 'Bandeira - '+nomeEstado ).attr('alt', 'Bandeira - '+nomeEstado );
          $('.infos-municipio').hide();
          $('<option value="">Selecione um município...</option>').appendTo(selectMunicipios);
        }

        var qtdMunicipios = 0;
        response.forEach( function(item) {
          if(estadoSelecionado == item.uf){
            $('<option value="'+item.nome_municipio+'">'+item.nome_municipio+'</option>').appendTo(selectMunicipios);
            qtdMunicipios++;
          }
        });
        $('.qtdMunicipios').text(qtdMunicipios);

        // change municipios
        selectMunicipios.change(function(){
          var nomeMunicipio = selectMunicipios.find('option:selected').text();
          $('.nomeMunicipio').text(nomeMunicipio);

          $('.codigoIbge, .latitude, .longitude').text('');
          $('.infos-municipio').hide();

          if(selectMunicipios.val() == ''){
            $('.carregando').hide();
          } else {
            $('.carregando').show();

            response.forEach( function(item) {
              if(estadoSelecionado == item.uf && nomeMunicipio == item.nome_municipio){
                $('.codigoIbge').text(item.codigo_ibge);
                $('.latitude').text(item.latitude);
                $('.longitude').text(item.longitude);
                $('#link-mapa').attr('href', 'http://maps.google.com/maps?q='+item.latitude+','+item.longitude+'');
              }
            }); // forEach

            $('.carregando').hide();
            $('.infos-municipio').show();

          } // if else
        }); // change municipios
      }); // change estados
    }, // success
    error: function() {
      alert('Não foi possível carregar os municípios.');
    }
  }); // ajax municipios
  // municipios

});
