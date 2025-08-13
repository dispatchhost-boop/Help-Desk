<!-- Delhivery API Variant -->
                            <div class="form-group mb-0" id="delhiveryVariantContainer" style="display: none;">
                              <select class="form-select" id="delhiveryVariantSelect" name="delhiveryApiVariant">
                                <option value="1">DELHIVERY DISPATCH</option>
                                <option value="2">DELHIVERY QUICKNFLY</option>
                              </select>
                            </div>





else if (courier === 'delhivery') {
    document.getElementById('delhiveryTabs').style.display = 'block';
    document.getElementById('save-button-express').style.display = 'inline-block';
    document.getElementById('basicDetails').style.display = 'flex';
    document.getElementById('zoneMappingFileExpress').style.display = 'flex';
    document.getElementById('delhiveryVariantContainer').style.display = 'block';




     // Hide all non-relevant tab panes for other couriers
     if (courier !== 'dtdc') {
        dtdcPaneIds.forEach(id => {
          const pane = document.querySelector(id);
          if (pane) pane.style.display = 'none';
        });
        
        // Show "no service" messages when not DTDC
        document.querySelectorAll('[id$="-no-service"]').forEach(msg => {
          msg.style.display = 'block';
        });
      }
      
      if (courier !== 'delhivery') {
        document.getElementById('delhiveryVariantContainer').style.display = 'none';
      }

    }
