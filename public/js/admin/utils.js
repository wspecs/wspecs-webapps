$.getFormValues = function(selector) {
 const map = {};
 $(selector).each(function() {
   const input = $(this);
   if (input.attr('sensitive') !== undefined) {
     map[input.data('key')] = btoa(input.val());
   } else {
     map[input.data('key')] = input.val();
   }
 });
 return map;
}
