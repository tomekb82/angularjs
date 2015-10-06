'use strict';

angular.module('myApp')
    .controller('GalleryController', function ($scope) {
console.log("start GalleryController");
      $scope.myInterval = 5000;
 $scope.noWrapSlides = false;
 var slides = $scope.slides = [];
 $scope.addSlide = function() {
   console.log('add slide2='+slides.length);
   var newWidth = 600 + slides.length + 1;
   slides.push({
     image: 'placekitten.com/' + newWidth + '/300',
     text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
       ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
   });
 };
 for (var i=0; i<4; i++) {
   console.log('add slide='+slides.length);
   $scope.addSlide();
 }
    });