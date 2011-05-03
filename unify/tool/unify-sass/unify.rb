require 'singleton'
require 'sass'

module Unify
  class Configuration
    include Singleton

    ATTRIBUTES = [
      :sass_path
    ]

    attr_accessor *ATTRIBUTES
  end
  
  module ConfigHelpers
    def configuration
      if block_given?
        yield Configuration.instance
      end
      Configuration.instance
    end
  end

  extend ConfigHelpers
  
  class Error < StandardError
  end

  class FilesystemConflict < Error
  end
  
  module Functions
  end
  
  # Compile one Sass file
  def Unify.compile(sass_filename, css_filename, options)
    engine = ::Sass::Engine.new(open(sass_filename).read,
                                    :filename => sass_filename,
                                    :line_comments => options[:line_comments],
                                    :style => options[:style],
                                    :css_filename => css_filename,
                                    :load_paths => options[:load_paths],
                                    :cache_location => options[:cache_location])
    
    sass_file = File.expand_path(sass_filename, File.dirname(__FILE__))
    
    Unify.configuration.sass_path = File.dirname(sass_file)
    css_content = engine.render
    Unify.write_file(css_filename, css_content, options.merge(:force => true))
  end

  def Unify.write_file(file_name, contents, options = nil, binary = false)
    options ||= self.options if self.respond_to?(:options)
    skip_write = options[:dry_run]
    mode = "w"
    mode << "b" if binary
    open(file_name, mode) do |file|
      file.write(contents)
    end
  end
  
end