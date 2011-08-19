$.widget("spf.menugrid", {
	_create: function() {
		var grid = this.element.data( "grid" );
		var source = grid.options.source;
		var headers = this.element.find( "th" );
		this._hoverable( headers );
		headers.click( function() {
			headers.not( this ).removeClass( "sorted sorted-desc" );
			var column = grid.options.columns[ this.cellIndex ];
			var sorted = $(this).hasClass("sorted");
			$( this ).toggleClass("sorted", !sorted).toggleClass("sorted-desc", sorted);
			source
				.option( "sort", ( sorted ? "-" : "" ) + column.property )
				.refresh();
		}).append( '<span class="ui-icon-asc ui-icon ui-icon-carat-1-n"></span><span class="ui-icon-desc ui-icon ui-icon-carat-1-s"></span>' );

		var thead = this.element.find( "thead" );
		var inputs = thead.children()
			.clone()
			.insertAfter( thead )
			.find( "th" )
				.removeAttr("tabindex")
				.each(function() {
					$( "<input>" ).appendTo( $( this ).empty() );
				});

		inputs.find( "input" ).bind( "change", function() {
			var head = $( this ).parent(),
				field = head.data( "field" ),
				type = head.data( "type" ),
				value = this.value,
				operator;

			if ( /^[<>]=?/.test( value ) ) {
				operator = value.replace( /^([<>]=?).+/, "$1" );
				value = value.substring( operator.length );
				value = value == null || isNaN( value ) ? "" : value;
			}
			if ( type === "number" ) {
				value = parseFloat( value );
				operator = operator || "==";
			}
			if ( type === "string" ) {
				operator = "like";
			}
			if ( value ) {
				source.option( "filter." + field, {
					operator: operator,
					value: value
				});
			} else {
				source.option( "filter." + field, null );
			}
			source.refresh();
		});
	}
});