require 'base64'



module Unify::Functions::InlineImage
  $usedimages = []
  
  def inline_image(path, mime_type = nil)
    path = path.value

    if $usedimages.index(path) != nil
      print "  - DOUBLE: " + path + "\n"
    else
      $usedimages.push(path)
    end
    
    real_filename = options[:real_filename]
    user_filename = options[:filename]
    real_path = File.expand_path(File.join(File.dirname(real_filename), path))
    user_path = File.expand_path(File.join(File.dirname(user_filename), path))
    if File.readable?(user_path)
      url = "url('data:#{compute_mime_type(path,mime_type)};base64,#{data(user_path, "")}')"
    else
      url = "url('data:#{compute_mime_type(path,mime_type)};base64,#{data(real_path, user_path)}')"
    end
    
    if url.length > 2000
      print "  - SIZE  : " + path + ": (" + url.length.to_s  + " bytes)" + "\n"
    end
    
    Sass::Script::String.new(url)
  end

private
  def compute_mime_type(path, mime_type)
    return mime_type if mime_type
    case path
    when /\.png$/i
      'image/png'
    when /\.jpe?g$/i
      'image/jpeg'
    when /\.gif$/i
      'image/gif'
    when /\.([a-zA-Z]+)$/
      "image/#{Regexp.last_match(1).downcase}"
    else
      raise Unify::Error, "A mime type could not be determined for #{path}, please specify one explicitly."
    end
  end

  def data(real_path, user_path)
    if File.readable?(real_path)
      file = File.open(real_path, "rb")
      Base64.encode64(file.read).gsub("\n","")
    else
      raise Unify::Error, "File not found or cannot be read: #{real_path} or #{user_path}"
    end
  end
end 
