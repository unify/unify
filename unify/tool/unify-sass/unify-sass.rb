require 'unify.rb'
require 'Functions/ImageSize.rb'
require 'Functions/InlineImage.rb'
require 'Functions/GradientSupport.rb'

# Add Unify sassscript functions to sass compiler
module Sass::Script::Functions
  include Unify::Functions::ImageSize
  include Unify::Functions::InlineImage
  include Unify::Functions::GradientSupport::Functions
end

# Re-evaluate function context
class Sass::Script::Functions::EvaluationContext
  include Sass::Script::Functions
end

Unify.compile(ARGV[0], ARGV[1], {:style => :compressed})