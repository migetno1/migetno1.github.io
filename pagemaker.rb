##########################################################
# pagemaker.rb
# Creates index.html and rmt/index.html
##########################################################

require_relative 'pagemaker/createindex'


createindex('rmt')
createindex('swc')
createindex('swccustom')