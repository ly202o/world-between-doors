var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var YunagiScene = (function () {
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __pow = Math.pow;
    var __defNormalProp = function (obj, key, value) { return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value }) : obj[key] = value; };
    var __spreadValues = function (a, b) {
        var e_1, _d;
        for (var prop in b || (b = {}))
            if (__hasOwnProp.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
            try {
                for (var _e = __values(__getOwnPropSymbols(b)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var prop = _f.value;
                    if (__propIsEnum.call(b, prop))
                        __defNormalProp(a, prop, b[prop]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        return a;
    };
    var __spreadProps = function (a, b) { return __defProps(a, __getOwnPropDescs(b)); };
    var __export = function (target, all) {
        for (var name in all)
            __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = function (to, from, except, desc) {
        var e_2, _d;
        if (from && typeof from === "object" || typeof from === "function") {
            var _loop_1 = function (key) {
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, { get: function () { return from[key]; }, enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
            };
            try {
                for (var _e = __values(__getOwnPropNames(from)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var key = _f.value;
                    _loop_1(key);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return to;
    };
    var __toCommonJS = function (mod) { return __copyProps(__defProp({}, "__esModule", { value: true }), mod); };
    var yunagi_adapter_exports = {};
    __export(yunagi_adapter_exports, {
        build: function () { return build; }
    });
    function build(THREE, renderer) {
        var BufferGeometry = THREE.BufferGeometry, BufferAttribute = THREE.BufferAttribute, mergeGeometries = mergeBufferGeometries;
        function mergeBufferGeometries(geometries, useGroups) {
            if (useGroups === void 0) { useGroups = false; }
            var isIndexed = geometries[0].index !== null;
            var attributesUsed = new Set(Object.keys(geometries[0].attributes));
            var morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
            var attributes = {};
            var morphAttributes = {};
            var morphTargetsRelative = geometries[0].morphTargetsRelative;
            var mergedGeometry = new BufferGeometry();
            var offset = 0;
            for (var i = 0; i < geometries.length; ++i) {
                var geometry = geometries[i];
                var attributesCount = 0;
                if (isIndexed !== (geometry.index !== null)) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
                    return null;
                }
                for (var name in geometry.attributes) {
                    if (!attributesUsed.has(name)) {
                        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
                        return null;
                    }
                    if (attributes[name] === void 0)
                        attributes[name] = [];
                    attributes[name].push(geometry.attributes[name]);
                    attributesCount++;
                }
                if (attributesCount !== attributesUsed.size) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes.");
                    return null;
                }
                if (morphTargetsRelative !== geometry.morphTargetsRelative) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries.");
                    return null;
                }
                for (var name in geometry.morphAttributes) {
                    if (!morphAttributesUsed.has(name)) {
                        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries.");
                        return null;
                    }
                    if (morphAttributes[name] === void 0)
                        morphAttributes[name] = [];
                    morphAttributes[name].push(geometry.morphAttributes[name]);
                }
                if (useGroups) {
                    var count = void 0;
                    if (isIndexed) {
                        count = geometry.index.count;
                    }
                    else if (geometry.attributes.position !== void 0) {
                        count = geometry.attributes.position.count;
                    }
                    else {
                        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute");
                        return null;
                    }
                    mergedGeometry.addGroup(offset, count, i);
                    offset += count;
                }
            }
            if (isIndexed) {
                var indexOffset = 0;
                var mergedIndex = [];
                for (var i = 0; i < geometries.length; ++i) {
                    var index = geometries[i].index;
                    for (var j = 0; j < index.count; ++j) {
                        mergedIndex.push(index.getX(j) + indexOffset);
                    }
                    indexOffset += geometries[i].attributes.position.count;
                }
                mergedGeometry.setIndex(mergedIndex);
            }
            for (var name in attributes) {
                var mergedAttribute = mergeBufferAttributes(attributes[name]);
                if (!mergedAttribute) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " attribute.");
                    return null;
                }
                mergedGeometry.setAttribute(name, mergedAttribute);
            }
            for (var name in morphAttributes) {
                var numMorphTargets = morphAttributes[name][0].length;
                if (numMorphTargets === 0)
                    break;
                mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
                mergedGeometry.morphAttributes[name] = [];
                for (var i = 0; i < numMorphTargets; ++i) {
                    var morphAttributesToMerge = [];
                    for (var j = 0; j < morphAttributes[name].length; ++j) {
                        morphAttributesToMerge.push(morphAttributes[name][j][i]);
                    }
                    var mergedMorphAttribute = mergeBufferAttributes(morphAttributesToMerge);
                    if (!mergedMorphAttribute) {
                        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " morphAttribute.");
                        return null;
                    }
                    mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
                }
            }
            return mergedGeometry;
        }
        function mergeBufferAttributes(attributes) {
            var TypedArray;
            var itemSize;
            var normalized;
            var arrayLength = 0;
            for (var i = 0; i < attributes.length; ++i) {
                var attribute = attributes[i];
                if (attribute.isInterleavedBufferAttribute) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.");
                    return null;
                }
                if (TypedArray === void 0)
                    TypedArray = attribute.array.constructor;
                if (TypedArray !== attribute.array.constructor) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.");
                    return null;
                }
                if (itemSize === void 0)
                    itemSize = attribute.itemSize;
                if (itemSize !== attribute.itemSize) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.");
                    return null;
                }
                if (normalized === void 0)
                    normalized = attribute.normalized;
                if (normalized !== attribute.normalized) {
                    console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.");
                    return null;
                }
                arrayLength += attribute.array.length;
            }
            var array = new TypedArray(arrayLength);
            var offset = 0;
            for (var i = 0; i < attributes.length; ++i) {
                array.set(attributes[i].array, offset);
                offset += attributes[i].array.length;
            }
            return new BufferAttribute(array, itemSize, normalized);
        }
        var STOCK_SHADOW_CHUNK = THREE.ShaderChunk.shadowmap_pars_fragment;
        var SITE_HALF_WIDTH = 14;
        var SITE_WIDTH = SITE_HALF_WIDTH * 2;
        var SITE_LENGTH = 33;
        var SITE_CENTER_Z = -0.6;
        var SITE_BACK = SITE_CENTER_Z - SITE_LENGTH / 2;
        var SITE_FRONT = SITE_CENTER_Z + SITE_LENGTH / 2;
        var RAIL_CENTER_Z = -3.4;
        var ROAD_LEFT = -0.42;
        var ROAD_RIGHT = 4.86;
        var DRIVEWAY_BACK = 8.65;
        var DRIVEWAY_FRONT = 11.55;
        var CURB_RAMP_TOP = ROAD_RIGHT + 0.57;
        var STREET_BACK = SITE_BACK - 13;
        var STREET_FRONT = SITE_FRONT + 11;
        var ROAD_CENTER = (ROAD_LEFT + ROAD_RIGHT) / 2;
        var ROAD_WIDTH = ROAD_RIGHT - ROAD_LEFT;
        var ROAD_EDGE = 0.013;
        var WALK_LEVEL = 0.176;
        var CROSSINGS = [-8.14, 2.28];
        var CROSSING_HALF = 0.86;
        var CROSSING_FLARE = 0.44;
        var CROSSING_RUN = 1.28;
        var ROAD_BOUNDS = { left: ROAD_LEFT, right: ROAD_RIGHT, back: STREET_BACK, front: STREET_FRONT };
        var ROAD_DRAINS = __spreadArray(__spreadArray([], __read([-12.85, -9.75, -6.59, -1.3, 0.73, 3.88, 9.1, 13.35].map(function (z) { return [ROAD_LEFT + 0.16, z, -1]; })), false), __read([-12.43, -9.76, -6.59, -1.46, 0.73, 3.88, 7.77, 12.29].map(function (z) { return [ROAD_RIGHT - 0.16, z, 1]; })), false);
        var UTILITY_COVERS = [[0.4, 4.87, 0.24], [3.86, -0.22, 0.23], [0.32, -5.62, 0.24], [4.14, -14.6, 0.22], [0.7, 13.03, 0.246]];
        var BASE_DEPTH = 1.03;
        var UP = new THREE.Vector3(0, 1, 0);
        function randomFrom(seed) {
            return function () {
                seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
                return seed / 4294967296;
            };
        }
        function paintedTexture(width, height, draw) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            draw(canvas.getContext("2d"), width, height);
            var texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 8;
            return texture;
        }
        var material = function (color, options) {
            if (options === void 0) { options = {}; }
            return new THREE.MeshStandardMaterial(__spreadValues({ color: color, roughness: 0.85 }, options));
        };
        var blockGeometry = new THREE.BoxGeometry(1, 1, 1);
        var cylinderGeometryCache = new Map();
        function createBuildingLightPaint() {
            var patches = [];
            var rain = { value: 0 };
            function add(host, position, size, tint, strength, horizontal) {
                var _d, _e;
                if (horizontal === void 0) { horizontal = false; }
                var stamp = new THREE.Object3D();
                (_d = stamp.position).set.apply(_d, __spreadArray([], __read(position), false));
                (_e = stamp.scale).set.apply(_e, __spreadArray(__spreadArray([], __read(size), false), [1], false));
                if (horizontal)
                    stamp.rotation.x = -Math.PI / 2;
                stamp.updateMatrix();
                patches.push({ host: host, matrix: stamp.matrix, color: new THREE.Color(tint).multiplyScalar(strength) });
            }
            function mount(parent) {
                var finish = new THREE.ShaderMaterial({
                    uniforms: { buildingRain: rain },
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    vertexShader: "\n            varying vec2 brush;\n            varying vec3 place;\n            varying vec3 tint;\n            void main() {\n              vec4 world = modelMatrix * instanceMatrix * vec4(position,1.0);\n              brush = uv * 2.0 - 1.0;\n              place = world.xyz;\n              tint = instanceColor;\n              gl_Position = projectionMatrix * viewMatrix * world;\n            }",
                    fragmentShader: "\n            uniform float buildingRain;\n            varying vec2 brush;\n            varying vec3 place;\n            varying vec3 tint;\n            void main() {\n              float reach = length(brush);\n              float feather = (1.0-smoothstep(0.43,1.0,reach));\n              float light = feather * (0.24 + 0.76 * exp(-4.2*dot(brush,brush)));\n              float border = max(abs(place.x)/".concat(SITE_HALF_WIDTH.toFixed(1), ",abs(place.z-(").concat(SITE_CENTER_Z, "))/").concat(SITE_LENGTH / 2, ");\n              float lowMist = smoothstep(0.75,1.08,border) * exp(-max(place.y-0.17,0.0)*0.87);\n              gl_FragColor = vec4(tint,light * (1.0-lowMist) * mix(0.88,1.27,buildingRain));\n              #include <tonemapping_fragment>\n              #include <colorspace_fragment>\n            }")
                });
                parent.updateWorldMatrix(true, true);
                var intoParent = parent.matrixWorld.clone().invert();
                var matrix2 = new THREE.Matrix4();
                var batch = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), finish, patches.length);
                batch.name = "Painted building light pools";
                batch.renderOrder = -2;
                patches.forEach(function (_d, index) {
                    var host = _d.host, local = _d.matrix, color = _d.color;
                    batch.setMatrixAt(index, matrix2.copy(intoParent).multiply(host.matrixWorld).multiply(local));
                    batch.setColorAt(index, color);
                });
                parent.add(batch);
            }
            return { add: add, mount: mount, setRain: function (amount) {
                    rain.value = amount;
                } };
        }
        function batchStaticParts(root) {
            var e_3, _d, e_4, _e, e_5, _f, e_6, _g, e_7, _h;
            root.updateWorldMatrix(true, true);
            var cellSize = 8;
            var sectors = new Map();
            var inverse = root.matrixWorld.clone().invert();
            var center = new THREE.Vector3();
            var geometryMatrix = new THREE.Matrix4();
            var instanceMatrix = new THREE.Matrix4();
            var _loop_2 = function (section) {
                section.traverseVisible(function (part) {
                    if (!part.isMesh || part.children.length || part.name || Object.keys(part.userData).length || Array.isArray(part.material) || part.material.transparent || !part.material.visible || part.renderOrder !== 0 || part.layers.mask !== 1 || !part.frustumCulled || part.instanceColor || part.customDepthMaterial || part.geometry.morphAttributes.position || part.matrixWorld.determinant() <= 0)
                        return;
                    if (part.isInstancedMesh) {
                        if (!part.boundingSphere)
                            part.computeBoundingSphere();
                        center.copy(part.boundingSphere.center);
                    }
                    else {
                        if (!part.geometry.boundingSphere)
                            part.geometry.computeBoundingSphere();
                        center.copy(part.geometry.boundingSphere.center);
                    }
                    center.applyMatrix4(part.matrixWorld);
                    var sector = section.isGroup && section.name ? section.id : "".concat(Math.floor(center.x / cellSize), ",").concat(Math.floor(center.z / cellSize));
                    var key = "".concat(sector, "/").concat(part.material.id, "/").concat(part.castShadow, "/").concat(part.receiveShadow);
                    if (!sectors.has(key))
                        sectors.set(key, []);
                    sectors.get(key).push(part);
                });
            };
            try {
                for (var _j = __values(root.children), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var section = _k.value;
                    _loop_2(section);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                }
                finally { if (e_3) throw e_3.error; }
            }
            function replaceParts(parts, replacement) {
                var e_8, _d;
                var first = parts[0];
                replacement.castShadow = first.castShadow;
                replacement.receiveShadow = first.receiveShadow;
                try {
                    for (var parts_2 = __values(parts), parts_2_1 = parts_2.next(); !parts_2_1.done; parts_2_1 = parts_2.next()) {
                        var part = parts_2_1.value;
                        part.removeFromParent();
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (parts_2_1 && !parts_2_1.done && (_d = parts_2.return)) _d.call(parts_2);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                root.add(replacement);
            }
            try {
                for (var _l = __values(sectors.values()), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var parts = _m.value;
                    if (parts.length < 2)
                        continue;
                    var byGeometry = new Map();
                    try {
                        for (var parts_1 = (e_5 = void 0, __values(parts)), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                            var part = parts_1_1.value;
                            if (!byGeometry.has(part.geometry))
                                byGeometry.set(part.geometry, []);
                            byGeometry.get(part.geometry).push(part);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (parts_1_1 && !parts_1_1.done && (_f = parts_1.return)) _f.call(parts_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    var smallPieces = [];
                    try {
                        for (var byGeometry_1 = (e_6 = void 0, __values(byGeometry)), byGeometry_1_1 = byGeometry_1.next(); !byGeometry_1_1.done; byGeometry_1_1 = byGeometry_1.next()) {
                            var _o = __read(byGeometry_1_1.value, 2), geometry = _o[0], pieces = _o[1];
                            if (pieces.length === 1) {
                                var _p = __read(pieces, 1), part = _p[0];
                                if (!part.isInstancedMesh && geometry.index && geometry.attributes.position.count < 1800 && Object.keys(geometry.attributes).sort().join(",") === "normal,position,uv" && geometry.drawRange.start === 0 && geometry.drawRange.count === Infinity)
                                    smallPieces.push(part);
                                continue;
                            }
                            var count = pieces.reduce(function (sum, part) { return sum + (part.isInstancedMesh ? part.count : 1); }, 0);
                            var batch = new THREE.InstancedMesh(geometry, pieces[0].material, count);
                            var index = 0;
                            try {
                                for (var pieces_1 = (e_7 = void 0, __values(pieces)), pieces_1_1 = pieces_1.next(); !pieces_1_1.done; pieces_1_1 = pieces_1.next()) {
                                    var part = pieces_1_1.value;
                                    var matrix2 = geometryMatrix.multiplyMatrices(inverse, part.matrixWorld);
                                    if (part.isInstancedMesh) {
                                        for (var i = 0; i < part.count; i++) {
                                            part.getMatrixAt(i, instanceMatrix);
                                            batch.setMatrixAt(index++, instanceMatrix.premultiply(matrix2));
                                        }
                                    }
                                    else
                                        batch.setMatrixAt(index++, matrix2);
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (pieces_1_1 && !pieces_1_1.done && (_h = pieces_1.return)) _h.call(pieces_1);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            replaceParts(pieces, batch);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (byGeometry_1_1 && !byGeometry_1_1.done && (_g = byGeometry_1.return)) _g.call(byGeometry_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    if (smallPieces.length >= 3) {
                        var geometries = smallPieces.map(function (part) { return part.geometry.clone().applyMatrix4(geometryMatrix.multiplyMatrices(inverse, part.matrixWorld)); });
                        var merged = mergeGeometries(geometries);
                        if (merged)
                            replaceParts(smallPieces, new THREE.Mesh(merged, smallPieces[0].material));
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_e = _l.return)) _e.call(_l);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        function place(parent, geometry, finish, x, y, z, cast) {
            if (cast === void 0) { cast = true; }
            var mesh = new THREE.Mesh(geometry, finish);
            mesh.position.set(x, y, z);
            mesh.castShadow = cast;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        }
        function block(parent, finish, x, y, z, width, height, depth, cast) {
            if (cast === void 0) { cast = true; }
            var mesh = place(parent, blockGeometry, finish, x, y, z, cast);
            mesh.scale.set(width, height, depth);
            return mesh;
        }
        function cylinder(parent, finish, x, y, z, top, bottom, height, segments) {
            if (segments === void 0) { segments = 10; }
            var key = [top, bottom, segments].join("/");
            if (!cylinderGeometryCache.has(key)) {
                cylinderGeometryCache.set(key, new THREE.CylinderGeometry(top, bottom, 1, segments));
            }
            var mesh = place(parent, cylinderGeometryCache.get(key), finish, x, y, z);
            mesh.scale.y = height;
            return mesh;
        }
        function rod(parent, finish, start, end, radius, endRadius, segments) {
            var _d, _e;
            if (endRadius === void 0) { endRadius = radius; }
            if (segments === void 0) { segments = 8; }
            var a = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(start), false)))();
            var b = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(end), false)))();
            var mid = a.clone().lerp(b, 0.5);
            var mesh = cylinder(parent, finish, mid.x, mid.y, mid.z, endRadius, radius, a.distanceTo(b), segments);
            mesh.quaternion.setFromUnitVectors(UP, b.sub(a).normalize());
            return mesh;
        }
        function tube(parent, finish, points, radius) {
            var curve = new THREE.CatmullRomCurve3(points.map(function (point) {
                var _d;
                return new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(point), false)))();
            }));
            return place(parent, new THREE.TubeGeometry(curve, 24, radius, 6, false), finish, 0, 0, 0);
        }
        function crossingEdges(center) {
            return [center - CROSSING_HALF, center + CROSSING_HALF];
        }
        function crossingHeight(x, z, direction) {
            var e_9, _d;
            var offset = direction < 0 ? ROAD_LEFT - x : x - ROAD_RIGHT;
            var reach = 1 - THREE.MathUtils.clamp(offset / CROSSING_RUN, 0, 1);
            var fade = 0;
            try {
                for (var CROSSINGS_1 = __values(CROSSINGS), CROSSINGS_1_1 = CROSSINGS_1.next(); !CROSSINGS_1_1.done; CROSSINGS_1_1 = CROSSINGS_1.next()) {
                    var center = CROSSINGS_1_1.value;
                    var beyond = Math.max(0, Math.abs(z - center) - CROSSING_HALF);
                    fade = Math.max(fade, 1 - THREE.MathUtils.clamp(beyond / CROSSING_FLARE, 0, 1));
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (CROSSINGS_1_1 && !CROSSINGS_1_1.done && (_d = CROSSINGS_1.return)) _d.call(CROSSINGS_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
            return WALK_LEVEL - 0.15 * reach * fade;
        }
        function roadHeight(x) {
            var shoulder = Math.min(Math.abs(x - ROAD_CENTER) / (ROAD_WIDTH / 2), 1);
            return ROAD_EDGE + 0.031 * (1 - shoulder);
        }
        function buildLoweredCurb(parent, finish, edge, direction, center) {
            var _d = __read(crossingEdges(center), 2), start = _d[0], end = _d[1];
            var breaks = [start - CROSSING_FLARE, start, end, end + CROSSING_FLARE];
            var positions = [];
            function section(z) {
                var low = crossingHeight(edge, z, direction);
                var crown = 8e-3 + 8e-3 * (low - 0.026) / 0.15;
                var backX = edge + direction * 0.12;
                return [
                    [edge - direction * 0.01, ROAD_EDGE - 4e-3, z],
                    [edge - direction * 0.01, Math.max(ROAD_EDGE + 2e-3, low - 0.014), z],
                    [edge + direction * 0.019, low + crown, z],
                    [backX, crossingHeight(backX, z, direction) + crown, z]
                ];
            }
            function quad(a, b, c, d) {
                positions.push.apply(positions, __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(a), false), __read(b), false), __read(c), false), __read(a), false), __read(c), false), __read(d), false));
            }
            for (var k = 0; k < breaks.length - 1; k++) {
                var first = breaks[k], last = breaks[k + 1], pieces = Math.ceil((last - first) / 0.58);
                for (var i = 0; i < pieces; i++) {
                    var startZ = THREE.MathUtils.lerp(first, last, i / pieces);
                    var endZ = THREE.MathUtils.lerp(first, last, (i + 1) / pieces);
                    var a = section(startZ + 4e-3), b = section(endZ - 4e-3);
                    for (var j = 0; j < a.length - 1; j++)
                        quad(a[j], b[j], b[j + 1], a[j + 1]);
                    quad(a[0], a[1], a[2], a[3]);
                    quad(b[0], b[3], b[2], b[1]);
                }
            }
            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geometry.computeVertexNormals();
            place(parent, geometry, finish, 0, 0, 0, false);
        }
        function groundAtlas(bounds, width, height, paint) {
            return paintedTexture(width, height, function (ctx, w, h) {
                ctx.scale(w / (bounds.right - bounds.left), h / (bounds.front - bounds.back));
                ctx.translate(-bounds.left, -bounds.back);
                paint(ctx, bounds);
            });
        }
        function groundGrid(xs, zs, bounds, height) {
            var e_10, _d, e_11, _e;
            var positions = [], uvs = [], indices = [];
            try {
                for (var _f = __values(zs.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), row = _h[0], z = _h[1];
                    try {
                        for (var _j = (e_11 = void 0, __values(xs.entries())), _k = _j.next(); !_k.done; _k = _j.next()) {
                            var _l = __read(_k.value, 2), column = _l[0], x = _l[1];
                            positions.push(x, height(x, z), z);
                            uvs.push((x - bounds.left) / (bounds.right - bounds.left), (bounds.front - z) / (bounds.front - bounds.back));
                            if (!column || !row)
                                continue;
                            var d = row * xs.length + column, a = d - xs.length - 1;
                            indices.push(a, d - 1, d, a, d, d - xs.length);
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                }
                finally { if (e_10) throw e_10.error; }
            }
            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();
            return geometry;
        }
        function asphaltTexture() {
            return groundAtlas(ROAD_BOUNDS, 704, 3440, function (ctx, _d) {
                var e_12, _e, e_13, _f, e_14, _g, e_15, _h, e_16, _j, e_17, _k, e_18, _l, e_19, _m, e_20, _o;
                var left = _d.left, right = _d.right, back = _d.back, front = _d.front;
                var rng = randomFrom(42);
                var length = front - back;
                var base = ctx.createLinearGradient(left, back, right, front);
                base.addColorStop(0, "#525861");
                base.addColorStop(0.49, "#4c515d");
                base.addColorStop(1, "#595a63");
                ctx.fillStyle = base;
                ctx.fillRect(left, back, right - left, length);
                try {
                    for (var _p = __values([left, right - 0.34]), _q = _p.next(); !_q.done; _q = _p.next()) {
                        var x = _q.value;
                        ctx.fillStyle = "#3336403b";
                        ctx.fillRect(x, back, 0.34, length);
                        ctx.fillStyle = "#b7b9c31a";
                        ctx.fillRect(x + 0.11, back, 0.042, length);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                try {
                    for (var _r = __values([left + 0.86, left + 1.77, right - 0.86, right - 1.77]), _s = _r.next(); !_s.done; _s = _r.next()) {
                        var center = _s.value;
                        var ruts = ctx.createLinearGradient(center - 0.29, 0, center + 0.29, 0);
                        ruts.addColorStop(0, "#69707f00");
                        ruts.addColorStop(0.48, "#292a3f2c");
                        ruts.addColorStop(1, "#69707f00");
                        ctx.fillStyle = ruts;
                        ctx.fillRect(center - 0.29, back, 0.58, length);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (_s && !_s.done && (_f = _r.return)) _f.call(_r);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
                ctx.fillStyle = "#2e303b43";
                ctx.fillRect(ROAD_CENTER - 0.015, back, 0.03, length);
                ctx.fillStyle = "#96959f19";
                ctx.fillRect(ROAD_CENTER + 0.025, back, 0.018, length);
                try {
                    for (var _t = __values([[0.31, 4.93, 0.9, 0.98], [3.81, -0.35, 0.79, 1.08], [0.34, -5.56, 0.97, 1.01], [4.13, -14.57, 0.79, 0.89], [0.69, 13.04, 0.83, 0.92], [4.28, 9.97, 1.1, 2.26]]), _u = _t.next(); !_u.done; _u = _t.next()) {
                        var _v = __read(_u.value, 4), x = _v[0], z = _v[1], w = _v[2], d = _v[3];
                        ctx.fillStyle = "#3436437d";
                        ctx.beginPath();
                        ctx.roundRect(x - w / 2, z - d / 2, w, d, 0.11);
                        ctx.fill();
                        ctx.strokeStyle = "#8c879447";
                        ctx.lineWidth = 0.022;
                        ctx.stroke();
                        ctx.fillStyle = "#53525f64";
                        ctx.fillRect(x - w * 0.4, z - d * 0.41, w * 0.8, d * 0.81);
                    }
                }
                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                finally {
                    try {
                        if (_u && !_u.done && (_g = _t.return)) _g.call(_t);
                    }
                    finally { if (e_14) throw e_14.error; }
                }
                for (var i = 0; i < 29200; i++) {
                    var x = left + rng() * (right - left), z = back + rng() * length;
                    ctx.fillStyle = i % 3 ? "#dad7c82a" : "#21243246";
                    ctx.fillRect(x, z, 6e-3 + rng() * 0.021, 8e-3 + rng() * 0.02);
                }
                for (var i = 0; i < 920; i++) {
                    ctx.fillStyle = i % 3 ? "#96909813" : "#1e28321b";
                    ctx.fillRect(left + rng() * (right - left), back + rng() * length, 0.015 + rng() * 0.1, 0.022 + rng() * 0.16);
                }
                ctx.fillStyle = "#e0d9ca";
                try {
                    for (var CROSSINGS_2 = __values(CROSSINGS), CROSSINGS_2_1 = CROSSINGS_2.next(); !CROSSINGS_2_1.done; CROSSINGS_2_1 = CROSSINGS_2.next()) {
                        var center = CROSSINGS_2_1.value;
                        var _w = __read(crossingEdges(center), 2), start = _w[0], end = _w[1];
                        for (var i = 0; i < 8; i++)
                            ctx.fillRect(left + 0.165 + i * 0.651, start, 0.374, end - start);
                        ctx.fillRect(left + 0.35, end + 0.5, ROAD_CENTER - left - 0.46, 0.112);
                        ctx.fillRect(ROAD_CENTER + 0.11, start - 0.61, right - ROAD_CENTER - 0.46, 0.112);
                    }
                }
                catch (e_15_1) { e_15 = { error: e_15_1 }; }
                finally {
                    try {
                        if (CROSSINGS_2_1 && !CROSSINGS_2_1.done && (_h = CROSSINGS_2.return)) _h.call(CROSSINGS_2);
                    }
                    finally { if (e_15) throw e_15.error; }
                }
                ctx.fillStyle = "#babcbe";
                var crossings = CROSSINGS.map(function (center) { return [center - CROSSING_HALF - 0.14, center + CROSSING_HALF + 0.14]; });
                try {
                    for (var _x = __values([
                        [left + 0.337, crossings],
                        [right - 0.395, __spreadArray(__spreadArray([], __read(crossings), false), [[DRIVEWAY_BACK - 0.09, DRIVEWAY_FRONT + 0.1]], false)]
                    ]), _y = _x.next(); !_y.done; _y = _x.next()) {
                        var _z = __read(_y.value, 2), x = _z[0], gaps = _z[1];
                        var start = back;
                        try {
                            for (var gaps_1 = (e_17 = void 0, __values(gaps)), gaps_1_1 = gaps_1.next(); !gaps_1_1.done; gaps_1_1 = gaps_1.next()) {
                                var _0 = __read(gaps_1_1.value, 2), a = _0[0], b = _0[1];
                                ctx.fillRect(x, start, 0.062, a - start);
                                start = b;
                            }
                        }
                        catch (e_17_1) { e_17 = { error: e_17_1 }; }
                        finally {
                            try {
                                if (gaps_1_1 && !gaps_1_1.done && (_k = gaps_1.return)) _k.call(gaps_1);
                            }
                            finally { if (e_17) throw e_17.error; }
                        }
                        ctx.fillRect(x, start, 0.062, front - start);
                    }
                }
                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                finally {
                    try {
                        if (_y && !_y.done && (_j = _x.return)) _j.call(_x);
                    }
                    finally { if (e_16) throw e_16.error; }
                }
                var _loop_3 = function (z) {
                    if (CROSSINGS.some(function (c) { return z < c + CROSSING_HALF + 0.73 && z + 1.42 > c - CROSSING_HALF - 0.73; }))
                        return "continue";
                    ctx.fillRect(ROAD_CENTER - 0.043, z, 0.086, Math.min(1.42, front - z));
                };
                for (var z = back + 0.36; z < front - 0.2; z += 2.88) {
                    _loop_3(z);
                }
                var leftLane = left + ROAD_WIDTH * 0.25, rightLane = right - ROAD_WIDTH * 0.25;
                try {
                    for (var _1 = __values([[leftLane, 8.21, Math.PI], [leftLane, -4.82, Math.PI], [rightLane, -13.21, 0], [rightLane, -1.36, 0]]), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                        var _3 = __read(_2.value, 3), x = _3[0], z = _3[1], rotation = _3[2];
                        ctx.save();
                        ctx.translate(x, z);
                        ctx.rotate(rotation);
                        ctx.beginPath();
                        [[-0.082, -0.64], [0.082, -0.64], [0.082, 0.19], [0.28, 0.19], [0, 0.66], [-0.28, 0.19], [-0.082, 0.19]].forEach(function (_d) {
                            var _e = __read(_d, 2), a = _e[0], b = _e[1];
                            return ctx.lineTo(a, b);
                        });
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }
                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                finally {
                    try {
                        if (_2 && !_2.done && (_l = _1.return)) _l.call(_1);
                    }
                    finally { if (e_18) throw e_18.error; }
                }
                ctx.font = '700 .44px "Yu Gothic", "Microsoft YaHei", sans-serif';
                ctx.textAlign = "center";
                try {
                    for (var _4 = __values([[leftLane, 6.25, 0], [rightLane, -11.66, Math.PI]]), _5 = _4.next(); !_5.done; _5 = _4.next()) {
                        var _6 = __read(_5.value, 3), x = _6[0], z = _6[1], angle = _6[2];
                        ctx.save();
                        ctx.translate(x, z);
                        ctx.rotate(angle);
                        ctx.fillText("\u5F90", 0, -0.22);
                        ctx.fillText("\u884C", 0, 0.25);
                        ctx.restore();
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (_5 && !_5.done && (_m = _4.return)) _m.call(_4);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
                try {
                    for (var CROSSINGS_3 = __values(CROSSINGS), CROSSINGS_3_1 = CROSSINGS_3.next(); !CROSSINGS_3_1.done; CROSSINGS_3_1 = CROSSINGS_3.next()) {
                        var center = CROSSINGS_3_1.value;
                        for (var i = 0; i < 550; i++) {
                            ctx.fillStyle = i % 3 ? "#3437472d" : "#6b667759";
                            ctx.fillRect(left + rng() * ROAD_WIDTH, center - 1.49 + rng() * 2.98, 9e-3 + rng() * 0.042, 0.014 + rng() * 0.024);
                        }
                    }
                }
                catch (e_20_1) { e_20 = { error: e_20_1 }; }
                finally {
                    try {
                        if (CROSSINGS_3_1 && !CROSSINGS_3_1.done && (_o = CROSSINGS_3.return)) _o.call(CROSSINGS_3);
                    }
                    finally { if (e_20) throw e_20.error; }
                }
            });
        }
        function soilTexture(seed) {
            return paintedTexture(1024, 192, function (ctx, w, h) {
                var rng = randomFrom(seed);
                var layers = ["#8f8380", "#7d706c", "#61544f", "#66544f"];
                var levels = [0, 36, 70, 133];
                ctx.fillStyle = layers[0];
                ctx.fillRect(0, 0, w, h);
                for (var layer = 1; layer < layers.length; layer++) {
                    ctx.beginPath();
                    for (var x = 0; x <= w; x += 8) {
                        var y = levels[layer] + Math.sin(x / (49 + layer * 6) + layer * 1.38) * (layer > 2 ? 8 : 3) + Math.sin(x / 28) * 2;
                        ctx.lineTo(x, y);
                    }
                    ctx.lineTo(w, h);
                    ctx.lineTo(0, h);
                    ctx.closePath();
                    ctx.fillStyle = layers[layer];
                    ctx.fill();
                    ctx.strokeStyle = "#b6a09240";
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
                for (var i = 0; i < 2300; i++) {
                    ctx.fillStyle = ["#f7d4ae53", "#382d4a62", "#ab818865", "#dfb4a134"][Math.floor(rng() * 4)];
                    ctx.beginPath();
                    ctx.ellipse(rng() * w, 9 + rng() * (h - 12), 0.5 + rng() * 4.1, 0.28 + rng() * 1.3, (rng() - 0.5) * 2.7, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.strokeStyle = "#b5a48c52";
                for (var i = 0; i < 10; i++) {
                    var x = 20 + rng() * (w - 40);
                    ctx.beginPath();
                    ctx.moveTo(x, 14);
                    var length = 30 + rng() * 36;
                    for (var y = 18; y < length; y += 5) {
                        x += (rng() - 0.5) * 7;
                        ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
            });
        }
        function buildGround(parent, wetRoad) {
            var e_21, _d, e_22, _e, e_23, _f, e_24, _g, e_25, _h, e_26, _j, e_27, _k, e_28, _l, e_29, _m, e_30, _o, e_31, _p;
            var side = material("#ffffff", { map: soilTexture(201) });
            var otherSide = material("#ffffff", { map: soilTexture(85) });
            var dark = material("#2b3440");
            var trim = material("#8b817c");
            var footing = material("#4a4445");
            block(parent, [side, otherSide, dark, footing, otherSide, side], 0, -0.43, SITE_CENTER_Z, SITE_WIDTH, 0.86, SITE_LENGTH);
            block(parent, trim, 0, -0.015, SITE_CENTER_Z, SITE_WIDTH + 0.036, 0.034, SITE_LENGTH + 0.036);
            block(parent, dark, 0, -0.915, SITE_CENTER_Z, SITE_WIDTH + 0.088, 0.11, SITE_LENGTH + 0.088);
            block(parent, footing, 0, -1, SITE_CENTER_Z, SITE_WIDTH - 0.22, 0.06, SITE_LENGTH - 0.22);
            var grain = paintedTexture(256, 256, function (ctx, w, h) {
                var random = randomFrom(821);
                var pixels = ctx.createImageData(w, h);
                for (var i = 0; i < pixels.data.length; i += 4) {
                    var value = 105 + random() * 105;
                    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
                    pixels.data[i + 3] = 255;
                }
                ctx.putImageData(pixels, 0, 0);
            });
            grain.colorSpace = THREE.NoColorSpace;
            grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
            grain.repeat.set(26 * ROAD_WIDTH / SITE_WIDTH, 30 * (STREET_FRONT - STREET_BACK) / SITE_LENGTH);
            grain.offset.set(26 * (ROAD_LEFT + SITE_HALF_WIDTH) / SITE_WIDTH, 30 * (SITE_FRONT - STREET_FRONT) / SITE_LENGTH);
            var wetness = wetAsphaltMap();
            wetness.colorSpace = THREE.NoColorSpace;
            var asphaltFinish = new THREE.MeshPhysicalMaterial({
                map: asphaltTexture(),
                roughness: 0.92,
                metalness: 0.02,
                roughnessMap: wetness,
                clearcoat: 0.55,
                clearcoatMap: wetness,
                clearcoatRoughness: 1,
                clearcoatRoughnessMap: wetness,
                bumpMap: grain,
                bumpScale: 0.012
            });
            var road = groundGrid([ROAD_LEFT, ROAD_CENTER, ROAD_RIGHT], [SITE_BACK, SITE_FRONT], ROAD_BOUNDS, roadHeight);
            var asphalt = place(parent, road, asphaltFinish, 0, 0, 0, false);
            asphalt.name = "Street asphalt";
            var concrete = material("#a4a0a0");
            var paving = material("#b3b0ac", { roughness: 0.94, map: paintedTexture(256, 256, function (ctx, w, h) {
                    var rng = randomFrom(703);
                    ctx.fillStyle = "#e1d9d6";
                    ctx.fillRect(0, 0, w, h);
                    for (var j = 0; j < 8; j++) {
                        for (var i = -1; i < 8; i++) {
                            var offset = j % 2 * 20;
                            var tone = 228 + rng() * 19;
                            ctx.fillStyle = "rgb(".concat(tone + 4, ",").concat(tone, ",").concat(tone - 1, ")");
                            ctx.fillRect(i * 40 + offset + 1, j * 32 + 1, 38, 30);
                        }
                    }
                    for (var i = 0; i < 1100; i++) {
                        ctx.fillStyle = rng() > 0.5 ? "#66515b23" : "#fffff842";
                        ctx.fillRect(rng() * w, rng() * h, 1.6, 1.1);
                    }
                }) });
            paving.map.wrapS = paving.map.wrapT = THREE.RepeatWrapping;
            var curb = material("#e4cdc0");
            var groundLine = material("#8b7b79");
            var stamp = new THREE.Object3D();
            var detailBatches = new Map();
            function tile(finish, x, y, z, w, h, d, angle, pitch, roll, geometry) {
                if (angle === void 0) { angle = 0; }
                if (pitch === void 0) { pitch = 0; }
                if (roll === void 0) { roll = 0; }
                if (geometry === void 0) { geometry = blockGeometry; }
                stamp.position.set(x, y, z);
                stamp.scale.set(w, h, d);
                stamp.rotation.set(pitch, angle, roll, "ZXY");
                stamp.updateMatrix();
                var key = "".concat(finish.id, "/").concat(geometry.id);
                if (!detailBatches.has(key))
                    detailBatches.set(key, { finish: finish, geometry: geometry, matrices: [] });
                detailBatches.get(key).matrices.push(stamp.matrix.clone());
            }
            var rampRanges = CROSSINGS.map(function (center) {
                var _d = __read(crossingEdges(center), 2), a = _d[0], b = _d[1];
                return [a - CROSSING_FLARE, a, b, b + CROSSING_FLARE];
            });
            function sidewalk(x0, x1, z0, z1, direction) {
                var e_32, _d;
                if (direction === void 0) { direction = 0; }
                var width = x1 - x0;
                var depth = z1 - z0;
                var x = (x0 + x1) / 2;
                var z = (z0 + z1) / 2;
                var surface = paving.clone();
                surface.map = paving.map.clone();
                surface.map.repeat.set(width / 4, depth / 4);
                surface.map.needsUpdate = true;
                if (direction) {
                    var edge2_1 = direction < 0 ? x1 : x0, outer = direction < 0 ? x0 : x1;
                    var shoulder = edge2_1 + direction * CROSSING_RUN;
                    block(parent, concrete, (outer + shoulder) / 2, 0.083, z, Math.abs(outer - shoulder), 0.166, depth, false);
                    var start = z0;
                    try {
                        for (var rampRanges_1 = __values(rampRanges), rampRanges_1_1 = rampRanges_1.next(); !rampRanges_1_1.done; rampRanges_1_1 = rampRanges_1.next()) {
                            var _e = __read(rampRanges_1_1.value, 4), rampStart = _e[0], rampEnd = _e[3];
                            block(parent, concrete, (edge2_1 + shoulder) / 2, 0.083, (start + rampStart) / 2, CROSSING_RUN, 0.166, rampStart - start, false);
                            start = rampEnd;
                        }
                    }
                    catch (e_32_1) { e_32 = { error: e_32_1 }; }
                    finally {
                        try {
                            if (rampRanges_1_1 && !rampRanges_1_1.done && (_d = rampRanges_1.return)) _d.call(rampRanges_1);
                        }
                        finally { if (e_32) throw e_32.error; }
                    }
                    block(parent, concrete, (edge2_1 + shoulder) / 2, 0.083, (start + z1) / 2, CROSSING_RUN, 0.166, z1 - start, false);
                    block(parent, concrete, (edge2_1 + shoulder) / 2, 8e-3, z, CROSSING_RUN, 0.016, depth, false);
                    var xs = __spreadArray([outer], __read([0, 0.12, 0.235, 0.392, 0.48, 0.562, 0.744, 1.05, CROSSING_RUN].map(function (t) { return edge2_1 + direction * t; })), false).sort(function (a, b) { return a - b; });
                    var cuts = rampRanges.flatMap(function (_d) {
                        var _e = __read(_d, 4), a = _e[0], b = _e[1], c = _e[2], d = _e[3];
                        return [a, (a + b) / 2, b, c, (c + d) / 2, d];
                    });
                    var geometry = groundGrid(xs, __spreadArray(__spreadArray([z0], __read(cuts), false), [z1], false), { left: x0, right: x1, back: z0, front: z1 }, function (px, pz) { return crossingHeight(px, pz, direction); });
                    var walkway = place(parent, geometry, surface, 0, 0, 0, false);
                    walkway.name = direction < 0 ? "West sidewalk at crossings" : "East sidewalk at crossings";
                    return;
                }
                block(parent, concrete, x, 0.083, z, width, 0.166, depth, false);
                var ground = place(parent, new THREE.PlaneGeometry(width, depth), surface, x, 0.176, z, false);
                ground.rotation.x = -Math.PI / 2;
            }
            function edge(x, z0, z1, atCrossings) {
                var e_33, _d, e_34, _e;
                if (atCrossings === void 0) { atCrossings = false; }
                var count = Math.ceil((z1 - z0) / 0.7);
                var pitch = (z1 - z0) / count;
                for (var i = 0; i < count; i++) {
                    var segments = [[z0 + i * pitch, z0 + (i + 1) * pitch]];
                    if (atCrossings) {
                        var _loop_6 = function (low, high) {
                            segments = segments.flatMap(function (_d) {
                                var _e = __read(_d, 2), a = _e[0], b = _e[1];
                                return a >= high || b <= low ? [[a, b]] : [[a, Math.min(b, low)], [Math.max(a, high), b]];
                            });
                        };
                        try {
                            for (var rampRanges_2 = (e_33 = void 0, __values(rampRanges)), rampRanges_2_1 = rampRanges_2.next(); !rampRanges_2_1.done; rampRanges_2_1 = rampRanges_2.next()) {
                                var _f = __read(rampRanges_2_1.value, 4), low = _f[0], high = _f[3];
                                _loop_6(low, high);
                            }
                        }
                        catch (e_33_1) { e_33 = { error: e_33_1 }; }
                        finally {
                            try {
                                if (rampRanges_2_1 && !rampRanges_2_1.done && (_d = rampRanges_2.return)) _d.call(rampRanges_2);
                            }
                            finally { if (e_33) throw e_33.error; }
                        }
                    }
                    try {
                        for (var segments_1 = (e_34 = void 0, __values(segments)), segments_1_1 = segments_1.next(); !segments_1_1.done; segments_1_1 = segments_1.next()) {
                            var _g = __read(segments_1_1.value, 2), a = _g[0], b = _g[1];
                            if (b - a < 0.028)
                                continue;
                            var z = (a + b) / 2;
                            tile(curb, x, 0.1, z, b - a - 0.016, 0.184, 0.13, -Math.PI / 2);
                            tile(groundLine, x - 0.07, 0.013, z, b - a - 4e-3, 0.011, 0.027, -Math.PI / 2);
                        }
                    }
                    catch (e_34_1) { e_34 = { error: e_34_1 }; }
                    finally {
                        try {
                            if (segments_1_1 && !segments_1_1.done && (_e = segments_1.return)) _e.call(segments_1);
                        }
                        finally { if (e_34) throw e_34.error; }
                    }
                }
            }
            sidewalk(-SITE_HALF_WIDTH, ROAD_LEFT, SITE_BACK, SITE_FRONT, -1);
            sidewalk(ROAD_RIGHT, SITE_HALF_WIDTH, SITE_BACK, DRIVEWAY_BACK, 1);
            sidewalk(ROAD_RIGHT, SITE_HALF_WIDTH, DRIVEWAY_FRONT, SITE_FRONT);
            sidewalk(CURB_RAMP_TOP, SITE_HALF_WIDTH, DRIVEWAY_BACK, DRIVEWAY_FRONT);
            edge(ROAD_LEFT - 0.055, SITE_BACK, SITE_FRONT, true);
            edge(ROAD_RIGHT + 0.055, SITE_BACK, DRIVEWAY_BACK, true);
            edge(ROAD_RIGHT + 0.055, DRIVEWAY_FRONT, SITE_FRONT);
            var rampCurb = curb.clone();
            rampCurb.side = THREE.DoubleSide;
            try {
                for (var CROSSINGS_4 = __values(CROSSINGS), CROSSINGS_4_1 = CROSSINGS_4.next(); !CROSSINGS_4_1.done; CROSSINGS_4_1 = CROSSINGS_4.next()) {
                    var center = CROSSINGS_4_1.value;
                    buildLoweredCurb(parent, rampCurb, ROAD_LEFT, -1, center);
                    buildLoweredCurb(parent, rampCurb, ROAD_RIGHT, 1, center);
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (CROSSINGS_4_1 && !CROSSINGS_4_1.done && (_d = CROSSINGS_4.return)) _d.call(CROSSINGS_4);
                }
                finally { if (e_21) throw e_21.error; }
            }
            var apron = new THREE.BufferGeometry();
            apron.setAttribute("position", new THREE.Float32BufferAttribute([
                ROAD_RIGHT,
                ROAD_EDGE,
                DRIVEWAY_BACK,
                ROAD_RIGHT,
                ROAD_EDGE,
                DRIVEWAY_FRONT,
                CURB_RAMP_TOP,
                0.177,
                DRIVEWAY_FRONT,
                CURB_RAMP_TOP,
                0.177,
                DRIVEWAY_BACK
            ], 3));
            apron.setIndex([0, 1, 2, 0, 2, 3]);
            apron.computeVertexNormals();
            place(parent, apron, concrete, 0, 0, 0, false);
            var tactile = material("#ba8c3e");
            var raised = material("#e0ae56");
            function groundTile(finish, x, z, direction, y, w, h, d, geometry) {
                if (geometry === void 0) { geometry = blockGeometry; }
                var pitch = -Math.atan2(crossingHeight(x, z + 0.03, direction) - crossingHeight(x, z - 0.03, direction), 0.06);
                var roll = Math.atan2(crossingHeight(x + 0.03, z, direction) - crossingHeight(x - 0.03, z, direction), 0.06);
                tile(finish, x, crossingHeight(x, z, direction) + y, z, w, h, d, 0, pitch, roll, geometry);
            }
            try {
                for (var _q = __values([
                    [ROAD_LEFT - 0.48, [[SITE_BACK + 0.21, -9], [-7.1, -6.3], [-0.64, 3.6], [3.9, SITE_FRONT - 0.28]]],
                    [ROAD_RIGHT + 0.47, [[SITE_BACK + 0.21, -9], [-7.1, -5.6], [-0.63, 3.6], [4, 8.4], [11.83, SITE_FRONT - 0.28]]]
                ]), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var _s = __read(_r.value, 2), x = _s[0], ranges = _s[1];
                    var direction = x < ROAD_LEFT ? -1 : 1;
                    try {
                        for (var ranges_1 = (e_23 = void 0, __values(ranges)), ranges_1_1 = ranges_1.next(); !ranges_1_1.done; ranges_1_1 = ranges_1.next()) {
                            var _t = __read(ranges_1_1.value, 2), start = _t[0], end = _t[1];
                            var count = Math.round((end - start) / 0.32);
                            var pitch = (end - start) / count;
                            var _loop_4 = function (i) {
                                var z = start + (i + 0.5) * pitch;
                                var nearest = Math.min.apply(Math, __spreadArray([], __read(CROSSINGS.map(function (center) { return Math.abs(z - center); })), false));
                                var shift = 0.105 * (1 - THREE.MathUtils.clamp((nearest - CROSSING_HALF) / 0.35, 0, 1));
                                var tileX = x + direction * shift;
                                groundTile(tactile, tileX, z, direction, 7e-3, 0.32, 0.014, pitch - 0.012);
                                for (var j = -1; j <= 1; j++)
                                    groundTile(raised, tileX + j * 0.081, z, direction, 0.019, 0.022, 0.015, pitch * 0.77);
                            };
                            for (var i = 0; i < count; i++) {
                                _loop_4(i);
                            }
                        }
                    }
                    catch (e_23_1) { e_23 = { error: e_23_1 }; }
                    finally {
                        try {
                            if (ranges_1_1 && !ranges_1_1.done && (_f = ranges_1.return)) _f.call(ranges_1);
                        }
                        finally { if (e_23) throw e_23.error; }
                    }
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_e = _q.return)) _e.call(_q);
                }
                finally { if (e_22) throw e_22.error; }
            }
            var dot = new THREE.CylinderGeometry(1, 0.88, 1, 7);
            try {
                for (var CROSSINGS_5 = __values(CROSSINGS), CROSSINGS_5_1 = CROSSINGS_5.next(); !CROSSINGS_5_1.done; CROSSINGS_5_1 = CROSSINGS_5.next()) {
                    var center = CROSSINGS_5_1.value;
                    try {
                        for (var _u = (e_25 = void 0, __values([[ROAD_LEFT - 0.235, -1], [ROAD_RIGHT + 0.235, 1]])), _v = _u.next(); !_v.done; _v = _u.next()) {
                            var _w = __read(_v.value, 2), x = _w[0], direction = _w[1];
                            for (var i = -2; i <= 2; i++) {
                                var z = center + i * 0.321;
                                groundTile(tactile, x, z, direction, 8e-3, 0.314, 0.013, 0.308);
                                for (var r = -1; r <= 1; r++) {
                                    for (var c = -1; c <= 1; c++)
                                        groundTile(raised, x + r * 0.082, z + c * 0.081, direction, 0.019, 0.019, 0.012, 0.019, dot);
                                }
                            }
                        }
                    }
                    catch (e_25_1) { e_25 = { error: e_25_1 }; }
                    finally {
                        try {
                            if (_v && !_v.done && (_h = _u.return)) _h.call(_u);
                        }
                        finally { if (e_25) throw e_25.error; }
                    }
                }
            }
            catch (e_24_1) { e_24 = { error: e_24_1 }; }
            finally {
                try {
                    if (CROSSINGS_5_1 && !CROSSINGS_5_1.done && (_g = CROSSINGS_5.return)) _g.call(CROSSINGS_5);
                }
                finally { if (e_24) throw e_24.error; }
            }
            var castIron = material("#555863", { roughness: 0.76, metalness: 0.26 });
            var wornIron = material("#858083");
            var drainRim = material("#72777c", { roughness: 0.57, metalness: 0.27 });
            var recess = material("#2e303a", { roughness: 1 });
            var lidMap = paintedTexture(192, 192, function (ctx, w, h) {
                var e_35, _d;
                ctx.fillStyle = "#656871";
                ctx.fillRect(0, 0, w, h);
                ctx.translate(w / 2, h / 2);
                ctx.strokeStyle = "#a3a5a645";
                ctx.lineWidth = 2.1;
                try {
                    for (var _e = __values([82, 75, 42]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var r = _f.value;
                        ctx.beginPath();
                        ctx.arc(0, 0, r, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                catch (e_35_1) { e_35 = { error: e_35_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_35) throw e_35.error; }
                }
                for (var i = 0; i < 36; i++) {
                    ctx.save();
                    ctx.rotate(i * Math.PI / 18);
                    ctx.fillStyle = "#3a3946";
                    ctx.fillRect(-2.5, 63, 5, 14);
                    ctx.fillStyle = "#93929664";
                    ctx.fillRect(-2.5, 63, 1.3, 12);
                    ctx.restore();
                }
                ctx.textAlign = "center";
                ctx.fillStyle = "#a2a09b";
                ctx.font = 'bold 21px "Yu Gothic", sans-serif';
                ctx.fillText("\u96E8\u6C34", 0, 13);
                ctx.fillStyle = "#363943";
                ctx.fillRect(-10, -39, 20, 7);
                ctx.fillRect(-10, 33, 20, 7);
            });
            var lid = material("#abb0b1", { map: lidMap, metalness: 0.25, roughness: 0.68 });
            try {
                for (var UTILITY_COVERS_1 = __values(UTILITY_COVERS), UTILITY_COVERS_1_1 = UTILITY_COVERS_1.next(); !UTILITY_COVERS_1_1.done; UTILITY_COVERS_1_1 = UTILITY_COVERS_1.next()) {
                    var _x = __read(UTILITY_COVERS_1_1.value, 3), x = _x[0], z = _x[1], r = _x[2];
                    var y = roadHeight(x);
                    cylinder(parent, recess, x, y + 5e-4, z, r * 1.119, r * 1.12, 0.01, 24);
                    cylinder(parent, drainRim, x, y + 4e-3, z, r, r, 0.01, 25);
                    var face = place(parent, new THREE.CircleGeometry(r * 0.895, 24), lid, x, y + 0.011, z, false);
                    face.rotation.x = -Math.PI / 2;
                }
            }
            catch (e_26_1) { e_26 = { error: e_26_1 }; }
            finally {
                try {
                    if (UTILITY_COVERS_1_1 && !UTILITY_COVERS_1_1.done && (_j = UTILITY_COVERS_1.return)) _j.call(UTILITY_COVERS_1);
                }
                finally { if (e_26) throw e_26.error; }
            }
            try {
                for (var ROAD_DRAINS_1 = __values(ROAD_DRAINS), ROAD_DRAINS_1_1 = ROAD_DRAINS_1.next(); !ROAD_DRAINS_1_1.done; ROAD_DRAINS_1_1 = ROAD_DRAINS_1.next()) {
                    var _y = __read(ROAD_DRAINS_1_1.value, 2), x = _y[0], z = _y[1];
                    var y = roadHeight(x);
                    tile(recess, x, y + 2e-3, z, 0.235, 0.011, 0.482);
                    try {
                        for (var _z = (e_28 = void 0, __values([-0.108, 0.108])), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                            var offset = _0.value;
                            tile(drainRim, x + offset, y + 0.01, z, 0.02, 8e-3, 0.486);
                        }
                    }
                    catch (e_28_1) { e_28 = { error: e_28_1 }; }
                    finally {
                        try {
                            if (_0 && !_0.done && (_l = _z.return)) _l.call(_z);
                        }
                        finally { if (e_28) throw e_28.error; }
                    }
                    try {
                        for (var _1 = (e_29 = void 0, __values([-0.23, 0.23])), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                            var offset = _2.value;
                            tile(drainRim, x, y + 0.01, z + offset, 0.199, 8e-3, 0.022);
                        }
                    }
                    catch (e_29_1) { e_29 = { error: e_29_1 }; }
                    finally {
                        try {
                            if (_2 && !_2.done && (_m = _1.return)) _m.call(_1);
                        }
                        finally { if (e_29) throw e_29.error; }
                    }
                    for (var i = -4; i <= 4; i++)
                        tile(castIron, x, y + 9e-3, z + i * 0.046, 0.199, 9e-3, 0.017);
                }
            }
            catch (e_27_1) { e_27 = { error: e_27_1 }; }
            finally {
                try {
                    if (ROAD_DRAINS_1_1 && !ROAD_DRAINS_1_1.done && (_k = ROAD_DRAINS_1.return)) _k.call(ROAD_DRAINS_1);
                }
                finally { if (e_27) throw e_27.error; }
            }
            var _loop_5 = function (finish, geometry, matrices) {
                var instances = new THREE.InstancedMesh(geometry, finish, matrices.length);
                matrices.forEach(function (matrix2, index) { return instances.setMatrixAt(index, matrix2); });
                instances.receiveShadow = true;
                parent.add(instances);
            };
            try {
                for (var _3 = __values(detailBatches.values()), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                    var _5 = _4.value, finish = _5.finish, geometry = _5.geometry, matrices = _5.matrices;
                    _loop_5(finish, geometry, matrices);
                }
            }
            catch (e_30_1) { e_30 = { error: e_30_1 }; }
            finally {
                try {
                    if (_4 && !_4.done && (_o = _3.return)) _o.call(_3);
                }
                finally { if (e_30) throw e_30.error; }
            }
            var pipeClay = material("#b56845");
            var pipeWater = material("#779da5");
            var pipeCable = material("#d8a56e");
            var inner = material("#342934");
            function cutPipe(x, y, radius, finish, face, flare) {
                if (flare === void 0) { flare = 0.1; }
                var orientation = face === "front" ? Math.PI / 2 : 0;
                var z = face === "front" ? SITE_FRONT : x;
                var px = face === "front" ? x : SITE_HALF_WIDTH;
                var disc = place(parent, new THREE.CircleGeometry(radius * 0.94, 24), inner, px + (face === "front" ? 0 : 7e-3), y, z + (face === "front" ? 7e-3 : 0), false);
                disc.rotation.y = Math.PI / 2 - orientation;
                var flange = place(parent, new THREE.TorusGeometry(radius, flare, 8, 26), finish, px, y, z);
                flange.rotation.y = Math.PI / 2 - orientation;
                var gasket = place(parent, new THREE.TorusGeometry(radius * 0.77, flare * 0.22, 5, 24), wornIron, px + (face === "front" ? 0 : 0.012), y, z + (face === "front" ? 0.012 : 0), false);
                gasket.rotation.copy(flange.rotation);
                if (flare < 0.029)
                    return;
                for (var i = 0; i < 8; i++) {
                    var angle = i * Math.PI / 4;
                    var lateral = Math.cos(angle) * radius;
                    var offset = flare * 0.83;
                    place(parent, new THREE.SphereGeometry(flare * 0.25, 6, 5), wornIron, px + (face === "front" ? lateral : offset), y + Math.sin(angle) * radius, z + (face === "front" ? offset : lateral), false);
                }
            }
            cutPipe(-5.87, -0.44, 0.21, pipeClay, "front", 0.038);
            cutPipe(-0.14, -0.55, 0.135, pipeWater, "front", 0.027);
            try {
                for (var _6 = __values([5.8, 6, 6.2]), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                    var x = _7.value;
                    cutPipe(x, -0.37, 0.061, pipeCable, "front", 0.017);
                }
            }
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (_7 && !_7.done && (_p = _6.return)) _p.call(_6);
                }
                finally { if (e_31) throw e_31.error; }
            }
            cutPipe(3.43, -0.45, 0.196, pipeClay, "right", 0.034);
            cutPipe(-3.45, -0.59, 0.138, pipeWater, "right", 0.027);
            cutPipe(-0.61, -0.33, 0.065, pipeCable, "right", 0.016);
            cutPipe(-0.83, -0.33, 0.065, pipeCable, "right", 0.016);
            cutPipe(11.98, -0.53, 0.122, pipeWater, "right", 0.022);
            cutPipe(-12.9, -0.48, 0.174, pipeClay, "right", 0.031);
            return wetRoad ? buildPuddles(parent) : null;
        }
        function buildTrafficMirror(parent, copper, gray, reflectScene) {
            var mount = new THREE.Group();
            mount.name = "Roadside convex mirror";
            var x = 5.9, z = 1.04;
            mount.position.set(x, crossingHeight(x, z, 1) + 2e-3, z);
            mount.rotation.y = -0.23;
            parent.add(mount);
            cylinder(mount, gray, 0, 0.104, 0, 0.126, 0.153, 0.208, 16);
            cylinder(mount, copper, 0, 1.28, 0, 0.052, 0.076, 2.56, 14);
            cylinder(mount, gray, 0, 0.221, 0, 0.081, 0.093, 0.045, 14);
            rod(mount, copper, [0, 2.25, 0], [-0.13, 2.73, 0.04], 0.066);
            var head = new THREE.Group();
            head.position.set(-0.16, 2.75, 0.056);
            head.rotation.x = 0.128;
            mount.add(head);
            var shell = place(head, new THREE.CylinderGeometry(0.454, 0.435, 0.106, 34), copper, 0, 0, 0.018);
            shell.rotation.x = Math.PI / 2;
            place(head, new THREE.TorusGeometry(0.447, 0.039, 8, 42), copper, 0, 0, 0.086);
            var curvature = 1.04, aperture = 0.438;
            var rimAngle = Math.asin(aperture / curvature);
            var cap = new THREE.SphereGeometry(curvature, 40, 15, 0, 2 * Math.PI, 0, rimAngle);
            cap.rotateX(Math.PI / 2);
            cap.translate(0, 0, -curvature * Math.cos(rimAngle));
            if (!reflectScene) {
                var metal = material("#bac8d1", { metalness: 0.92, roughness: 0.25 });
                place(head, cap, metal, 0, 0, 0.068, false).name = "Convex traffic lens";
                return null;
            }
            var target = new THREE.WebGLRenderTarget(256, 256, { type: THREE.HalfFloatType });
            var view = new THREE.PerspectiveCamera(140, 1, 0.115, 45);
            var uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
                    reflectedStreet: { value: null },
                    captureDirection: { value: new THREE.Matrix4() },
                    mirrorReady: { value: 0 },
                    mirrorRain: { value: 0 }
                }]);
            uniforms.reflectedStreet.value = target.texture;
            var optical = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fog: true,
                vertexShader: "\n          varying vec3 lensNormal;\n          varying vec3 lensPosition;\n          #include <fog_pars_vertex>\n          void main() {\n            vec4 mvPosition=modelViewMatrix*vec4(position,1.0);\n            lensPosition=mvPosition.xyz;\n            lensNormal=normalMatrix*normal;\n            gl_Position=projectionMatrix*mvPosition;\n            #include <fog_vertex>\n          }",
                fragmentShader: "\n          uniform sampler2D reflectedStreet;\n          uniform mat4 captureDirection;\n          uniform float mirrorReady;\n          uniform float mirrorRain;\n          varying vec3 lensNormal;\n          varying vec3 lensPosition;\n          #include <fog_pars_fragment>\n          void main() {\n            vec3 eye=isOrthographic?vec3(0.0,0.0,1.0):normalize(-lensPosition);\n            vec3 reflected=reflect(-eye,normalize(lensNormal));\n            vec3 direction=vec3(dot(viewMatrix[0].xyz,reflected),\n                                dot(viewMatrix[1].xyz,reflected),\n                                dot(viewMatrix[2].xyz,reflected));\n            vec3 haze=mix(vec3(0.69,0.50,0.45),vec3(0.41,0.53,0.64),mirrorRain);\n            vec3 sky=mix(haze,vec3(0.37,0.49,0.68),smoothstep(0.02,0.70,direction.y));\n            vec3 color=mix(vec3(0.19,0.22,0.27),sky,smoothstep(-0.52,0.16,direction.y));\n            vec4 projected=captureDirection*vec4(direction,0.0);\n            if(mirrorReady>0.5 && projected.w>0.001) {\n              vec2 uv=projected.xy/projected.w*0.5+0.5;\n              float edge=max(abs(uv.x-0.5),abs(uv.y-0.5));\n              if(edge<0.5) {\n                vec4 detail=texture2D(reflectedStreet,uv);\n                float blend=detail.a*(1.0-smoothstep(0.34,0.50,edge));\n                color=mix(color,detail.rgb/max(detail.a,0.025),blend);\n              }\n            }\n            gl_FragColor=vec4(color*vec3(0.91,0.93,0.97),1.0);\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n            #include <fog_fragment>\n          }"
            });
            var lens = place(head, cap, optical, 0, 0, 0.068, false);
            lens.name = "Convex traffic lens";
            var forward = new THREE.Vector3(), aim = new THREE.Vector3(), clear = new THREE.Color();
            var capturedFor = -1;
            return {
                get capturedFor() {
                    return capturedFor;
                },
                setWeather: function (amount) {
                    uniforms.mirrorRain.value = amount;
                },
                capture: function (renderer2, scene, amount) {
                    lens.getWorldPosition(view.position);
                    forward.set(0, 0, 1).transformDirection(lens.matrixWorld);
                    view.up.set(0, 1, 0).transformDirection(lens.matrixWorld);
                    view.position.addScaledVector(forward, 0.038);
                    view.lookAt(aim.copy(view.position).add(forward));
                    view.updateMatrixWorld(true);
                    uniforms.captureDirection.value.multiplyMatrices(view.projectionMatrix, view.matrixWorldInverse);
                    var previous = renderer2.getRenderTarget(), background = scene.background;
                    var clearAlpha = renderer2.getClearAlpha(), shadowUpdate = renderer2.shadowMap.autoUpdate, autoClear = renderer2.autoClear;
                    renderer2.getClearColor(clear);
                    lens.visible = false;
                    scene.background = null;
                    renderer2.autoClear = true;
                    renderer2.shadowMap.autoUpdate = false;
                    renderer2.setClearColor(0, 0);
                    try {
                        renderer2.setRenderTarget(target);
                        renderer2.render(scene, view);
                        uniforms.mirrorReady.value = 1;
                        capturedFor = amount;
                    }
                    finally {
                        renderer2.setRenderTarget(previous);
                        renderer2.setClearColor(clear, clearAlpha);
                        renderer2.autoClear = autoClear;
                        renderer2.shadowMap.autoUpdate = shadowUpdate;
                        scene.background = background;
                        lens.visible = true;
                    }
                },
                invalidate: function () {
                    capturedFor = -1;
                    uniforms.mirrorReady.value = 0;
                },
                dispose: function () {
                    target.dispose();
                }
            };
        }
        function buildStreetFurniture(parent, reflectMirror) {
            var e_36, _d, e_37, _e, e_38, _f, e_39, _g, e_40, _h, e_41, _j, e_42, _k, e_43, _l, e_44, _m, e_45, _o;
            var cream = material("#e4dad1");
            var gray = material("#918990");
            var steel = material("#615b68");
            var copper = material("#cb5b36");
            var dark = material("#332c39");
            var lit = material("#fff1bd", { emissive: "#ffc581", emissiveIntensity: 1.45 });
            function guard(x0, z0, x1, z1) {
                var width = Math.hypot(x1 - x0, z1 - z0);
                var count = Math.ceil(width / 1.05);
                for (var i = 0; i <= count; i++) {
                    var f = i / count;
                    var x = THREE.MathUtils.lerp(x0, x1, f);
                    var z = THREE.MathUtils.lerp(z0, z1, f);
                    var sink = WALK_LEVEL - crossingHeight(x, z, x < ROAD_LEFT ? -1 : 1);
                    cylinder(parent, cream, x, 0.67 - sink / 2, z, 0.038, 0.041, 0.99 + sink);
                    cylinder(parent, steel, x, 0.25 - sink, z, 0.068, 0.074, 0.14);
                    cylinder(parent, copper, x, 1.016, z, 0.04, 0.04, 0.062);
                }
                rod(parent, cream, [x0, 1.06, z0], [x1, 1.06, z1], 0.056);
                rod(parent, cream, [x0, 0.54, z0], [x1, 0.54, z1], 0.041);
            }
            try {
                for (var _p = __values([
                    [ROAD_LEFT - 0.19, [[SITE_BACK + 0.68, -11.1], [-6.68, -3.3], [3.83, 7.6], [10.8, 13.7]]],
                    [ROAD_RIGHT + 0.19, [[SITE_BACK + 0.68, -11], [-6.81, -4.94], [3.55, 7.95], [11.96, SITE_FRONT - 0.6]]]
                ]), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var _r = __read(_q.value, 2), x = _r[0], segments = _r[1];
                    try {
                        for (var segments_2 = (e_37 = void 0, __values(segments)), segments_2_1 = segments_2.next(); !segments_2_1.done; segments_2_1 = segments_2.next()) {
                            var _s = __read(segments_2_1.value, 2), z0 = _s[0], z1 = _s[1];
                            guard(x, z0, x, z1);
                        }
                    }
                    catch (e_37_1) { e_37 = { error: e_37_1 }; }
                    finally {
                        try {
                            if (segments_2_1 && !segments_2_1.done && (_e = segments_2.return)) _e.call(segments_2);
                        }
                        finally { if (e_37) throw e_37.error; }
                    }
                }
            }
            catch (e_36_1) { e_36 = { error: e_36_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_d = _p.return)) _d.call(_p);
                }
                finally { if (e_36) throw e_36.error; }
            }
            var mirror = buildTrafficMirror(parent, copper, gray, reflectMirror);
            var signGraphic = paintedTexture(144, 144, function (ctx, w, h) {
                ctx.fillStyle = "#2b659b";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#fff5d8";
                ctx.beginPath();
                ctx.moveTo(72, 17);
                ctx.lineTo(127, 121);
                ctx.lineTo(17, 121);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#2b659b";
                ctx.beginPath();
                ctx.arc(75, 49, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#2b659b";
                ctx.lineWidth = 6;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(75, 61);
                ctx.lineTo(67, 83);
                ctx.lineTo(57, 101);
                ctx.moveTo(67, 83);
                ctx.lineTo(80, 87);
                ctx.lineTo(85, 108);
                ctx.moveTo(72, 63);
                ctx.lineTo(86, 73);
                ctx.lineTo(96, 74);
                ctx.moveTo(73, 64);
                ctx.lineTo(57, 69);
                ctx.lineTo(52, 80);
                ctx.stroke();
            });
            var crossSign = new THREE.Group();
            crossSign.name = "Pedestrian crossing sign";
            crossSign.position.set(5.72, 0, 3.33);
            parent.add(crossSign);
            var postZ = -0.102;
            var postFoot = crossingHeight(crossSign.position.x, crossSign.position.z + postZ, 1);
            var postTop = 2.46;
            cylinder(crossSign, steel, 0, (postFoot + postTop) / 2, postZ, 0.037, 0.045, postTop - postFoot, 14).name = "Crossing sign post";
            block(crossSign, cream, 0, 2.32, 0, 0.54, 0.54, 0.052).name = "Crossing sign housing";
            block(crossSign, gray, 0, 2.32, -0.032, 0.494, 0.49, 0.016, false);
            try {
                for (var _t = __values([2.18, 2.42]), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var y = _u.value;
                    block(crossSign, steel, 0, y, -0.06, 0.16, 0.043, 0.095);
                }
            }
            catch (e_38_1) { e_38 = { error: e_38_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_f = _t.return)) _f.call(_t);
                }
                finally { if (e_38) throw e_38.error; }
            }
            var trafficFace = place(crossSign, new THREE.PlaneGeometry(0.49, 0.49), new THREE.MeshBasicMaterial({ map: signGraphic }), 0, 2.32, 0.03, false);
            trafficFace.name = "Crossing sign graphic";
            var poles = [[-2.94, 7.38, 5.13], [6.91, 4.56, 5.83]];
            try {
                for (var poles_1 = __values(poles), poles_1_1 = poles_1.next(); !poles_1_1.done; poles_1_1 = poles_1.next()) {
                    var _v = __read(poles_1_1.value, 3), x = _v[0], z = _v[1], height = _v[2];
                    cylinder(parent, gray, x, 0.18 + height / 2, z, 0.074, 0.133, height, 14);
                    cylinder(parent, steel, x, 0.45, z, 0.121, 0.14, 0.56, 14);
                    cylinder(parent, cream, x, 0.71, z, 0.124, 0.124, 0.1, 14);
                    for (var i = 0; i < 4; i++) {
                        var y = 1.65 + i * 0.34;
                        rod(parent, steel, [x - 0.1, y, z], [x + 0.15, y, z], 0.018);
                    }
                    try {
                        for (var _w = (e_40 = void 0, __values([height - 0.57, height - 0.75])), _x = _w.next(); !_x.done; _x = _w.next()) {
                            var y = _x.value;
                            cylinder(parent, steel, x, y, z, 0.1, 0.1, 0.046);
                        }
                    }
                    catch (e_40_1) { e_40 = { error: e_40_1 }; }
                    finally {
                        try {
                            if (_x && !_x.done && (_h = _w.return)) _h.call(_w);
                        }
                        finally { if (e_40) throw e_40.error; }
                    }
                    block(parent, steel, x, height - 0.14, z, 1.08, 0.07, 0.09);
                    try {
                        for (var _y = (e_41 = void 0, __values([-0.44, 0, 0.44])), _z = _y.next(); !_z.done; _z = _y.next()) {
                            var offset = _z.value;
                            cylinder(parent, cream, x + offset, height - 0.04, z, 0.04, 0.055, 0.17);
                            cylinder(parent, steel, x + offset, height + 0.047, z, 0.043, 0.043, 0.035);
                        }
                    }
                    catch (e_41_1) { e_41 = { error: e_41_1 }; }
                    finally {
                        try {
                            if (_z && !_z.done && (_j = _y.return)) _j.call(_y);
                        }
                        finally { if (e_41) throw e_41.error; }
                    }
                    tube(parent, steel, [[x, height - 1.22, z], [x, height - 1.21, z + 0.35], [x, height - 1.11, z + 0.7], [x, height - 1.13, z + 0.91]], 0.033);
                    block(parent, steel, x, height - 1.13, z + 0.96, 0.21, 0.107, 0.34);
                    block(parent, lit, x, height - 1.188, z + 0.98, 0.16, 0.038, 0.23, false);
                }
            }
            catch (e_39_1) { e_39 = { error: e_39_1 }; }
            finally {
                try {
                    if (poles_1_1 && !poles_1_1.done && (_g = poles_1.return)) _g.call(poles_1);
                }
                finally { if (e_39) throw e_39.error; }
            }
            var _0 = __read(poles, 2), first = _0[0], second = _0[1];
            try {
                for (var _1 = __values([-0.44, 0, 0.44].entries()), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                    var _3 = __read(_2.value, 2), index = _3[0], offset = _3[1];
                    var points = [];
                    for (var i = 0; i <= 12; i++) {
                        var t = i / 12;
                        points.push([THREE.MathUtils.lerp(first[0], second[0], t) + offset, THREE.MathUtils.lerp(first[2], second[2], t) + 0.067 - (0.73 + 0.045 * index) * 4 * t * (1 - t), THREE.MathUtils.lerp(first[1], second[1], t)]);
                    }
                    tube(parent, dark, points, 0.013);
                }
            }
            catch (e_42_1) { e_42 = { error: e_42_1 }; }
            finally {
                try {
                    if (_2 && !_2.done && (_k = _1.return)) _k.call(_1);
                }
                finally { if (e_42) throw e_42.error; }
            }
            tube(parent, dark, [[first[0], first[2] - 0.63, first[1]], [-4.13, 4.19, 7.64], [-5.15, 4.27, 6.92], [-5.93, 4.65, 6.18]], 0.012);
            rod(parent, cream, [-5.93, 4.65, 6.1], [-5.93, 4.65, 6.21], 0.041);
            var lampMetal = material("#4d485f", { metalness: 0.21, roughness: 0.54 });
            function lamp(x, z, arm) {
                var poleHeight = 4.13;
                cylinder(parent, gray, x, 0.3, z, 0.16, 0.18, 0.24, 12);
                cylinder(parent, lampMetal, x, 2.22, z, 0.046, 0.072, 3.99, 12);
                tube(parent, lampMetal, [[x, poleHeight, z], [x + arm * 0.19, 4.39, z], [x + arm * 0.63, 4.48, z], [x + arm * 0.96, 4.46, z]], 0.032);
                block(parent, lampMetal, x + arm, 4.44, z, 0.39, 0.097, 0.22);
                block(parent, lit, x + arm, 4.384, z, 0.3, 0.023, 0.16, false);
                var pool = new THREE.PointLight("#ffcf9a", 21, 7, 2);
                pool.position.set(x + arm, 4.2, z);
                pool.userData.airGlow = 1;
                parent.add(pool);
            }
            lamp(ROAD_RIGHT + 1.04, -12.13, -1.23);
            lamp(ROAD_LEFT - 0.78, 10.48, 1.13);
            lamp(ROAD_RIGHT + 1, 6.95, -1.27);
            var busSign = paintedTexture(192, 236, function (ctx, w, h) {
                ctx.fillStyle = "#ead7b8";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#194855";
                ctx.fillRect(8, 8, w - 16, 85);
                ctx.fillStyle = "#fff1d7";
                ctx.textAlign = "center";
                ctx.font = 'bold 33px "Yu Gothic", sans-serif';
                ctx.fillText("\u5915\u51EA\u901A\u308A", w / 2, 48);
                ctx.font = "600 12px sans-serif";
                ctx.fillText("Y\u016ANAGI D\u014CRI", w / 2, 73);
                ctx.fillStyle = "#1b4452";
                for (var row = 0; row < 5; row++) {
                    ctx.fillRect(21, 113 + row * 17, w - 42, 2);
                    ctx.fillRect(32, 118 + row * 17, 18, 4);
                    ctx.fillRect(64, 118 + row * 17, 7, 4);
                    ctx.fillRect(91, 118 + row * 17, 48, 4);
                }
            });
            var benchWood = material("#b0694c");
            var benchX = -3.21;
            var benchZ = 11.52;
            try {
                for (var _4 = __values([benchZ - 0.66, benchZ + 0.66]), _5 = _4.next(); !_5.done; _5 = _4.next()) {
                    var z = _5.value;
                    rod(parent, steel, [benchX - 0.19, 0.23, z], [benchX - 0.19, 1.01, z], 0.031);
                    rod(parent, steel, [benchX + 0.22, 0.23, z], [benchX + 0.22, 0.61, z], 0.031);
                    rod(parent, steel, [benchX - 0.21, 0.56, z], [benchX + 0.24, 0.56, z], 0.027);
                }
            }
            catch (e_43_1) { e_43 = { error: e_43_1 }; }
            finally {
                try {
                    if (_5 && !_5.done && (_l = _4.return)) _l.call(_4);
                }
                finally { if (e_43) throw e_43.error; }
            }
            try {
                for (var _6 = __values([benchX - 0.15, benchX, benchX + 0.15]), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                    var x = _7.value;
                    block(parent, benchWood, x, 0.62, benchZ, 0.129, 0.056, 1.64);
                }
            }
            catch (e_44_1) { e_44 = { error: e_44_1 }; }
            finally {
                try {
                    if (_7 && !_7.done && (_m = _6.return)) _m.call(_6);
                }
                finally { if (e_44) throw e_44.error; }
            }
            try {
                for (var _8 = __values([0.83, 0.97]), _9 = _8.next(); !_9.done; _9 = _8.next()) {
                    var y = _9.value;
                    block(parent, benchWood, benchX - 0.195, y, benchZ, 0.059, 0.11, 1.64);
                }
            }
            catch (e_45_1) { e_45 = { error: e_45_1 }; }
            finally {
                try {
                    if (_9 && !_9.done && (_o = _8.return)) _o.call(_8);
                }
                finally { if (e_45) throw e_45.error; }
            }
            cylinder(parent, steel, -2.76, 1.23, 12.78, 0.041, 0.049, 2.1, 10);
            block(parent, cream, -2.76, 1.91, 12.78, 0.08, 0.59, 0.49);
            var timetable = place(parent, new THREE.PlaneGeometry(0.445, 0.54), new THREE.MeshBasicMaterial({ map: busSign }), -2.711, 1.91, 12.78, false);
            timetable.rotation.y = Math.PI / 2;
            return mirror;
        }
        function buildGreenery(parent) {
            var e_46, _d, e_47, _e;
            var soil = material("#685653");
            var stone = material("#aba1a0");
            var bark = material("#704f52");
            var rng = randomFrom(3781);
            var leafGeometry = new THREE.IcosahedronGeometry(1, 1);
            var cherry = ["#795570", "#a06689", "#b97b99", "#ce90a8", "#e4aebf", "#f8c4cc"].map(function (color) { return material(color, { roughness: 1 }); });
            var green = ["#527169", "#658779", "#82a18a", "#b0b68b"].map(function (color) { return material(color, { flatShading: true }); });
            var leaves = new Map();
            function leaf(finish, x, y, z, sx, sy, sz) {
                var matrix3 = new THREE.Matrix4();
                var rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(rng() * 3, rng() * 6, rng() * 2));
                matrix3.compose(new THREE.Vector3(x, y, z), rotation, new THREE.Vector3(sx, sy, sz));
                if (!leaves.has(finish))
                    leaves.set(finish, []);
                leaves.get(finish).push(matrix3);
            }
            function cherryTree(x, z, scale) {
                var e_48, _d;
                var y = 0.18;
                block(parent, stone, x, y + 0.13, z, 1.38, 0.26, 1.38);
                block(parent, soil, x, y + 0.265, z, 1.19, 0.018, 1.19, false);
                var crown = [x - 0.2 * scale, y + 2.1 * scale, z + 0.08 * scale];
                rod(parent, bark, [x, y + 0.23, z], crown, 0.17 * scale, 0.092 * scale, 9);
                var branches = [[-0.82, 2.78, -0.15], [0.78, 2.99, -0.21], [-0.24, 3.62, 0.11], [0.21, 3.12, 0.78], [-0.73, 3.22, 0.57], [0.55, 3.12, -0.84]];
                try {
                    for (var branches_1 = __values(branches), branches_1_1 = branches_1.next(); !branches_1_1.done; branches_1_1 = branches_1.next()) {
                        var _e = __read(branches_1_1.value, 3), dx = _e[0], dy = _e[1], dz = _e[2];
                        var target = [x + dx * scale, y + dy * scale, z + dz * scale];
                        rod(parent, bark, [crown[0], crown[1] - rng() * 0.44 * scale, crown[2]], target, 0.098 * scale, 0.025 * scale, 8);
                        leaf.apply(void 0, __spreadArray(__spreadArray([cherry[1]], __read(target), false), [0.43 * scale, 0.33 * scale, 0.4 * scale], false));
                        for (var i = 0; i < 62; i++) {
                            var angle = rng() * Math.PI * 2;
                            var r = Math.sqrt(rng()) * 0.75 * scale;
                            var radius = (0.075 + rng() * 0.14) * scale;
                            var height = (rng() - 0.42) * 0.7 * scale;
                            var tint = Math.floor(THREE.MathUtils.clamp(2 + height / scale * 4 + rng() * 2, 0, 5.9));
                            leaf(cherry[tint], target[0] + Math.cos(angle) * r, target[1] + height, target[2] + Math.sin(angle) * r, radius * 1.3, radius * 0.75, radius);
                        }
                    }
                }
                catch (e_48_1) { e_48 = { error: e_48_1 }; }
                finally {
                    try {
                        if (branches_1_1 && !branches_1_1.done && (_d = branches_1.return)) _d.call(branches_1);
                    }
                    finally { if (e_48) throw e_48.error; }
                }
            }
            cherryTree(10.42, -6.8, 1.11);
            cherryTree(-10, -6.28, 0.88);
            cherryTree(-4.56, 12.25, 0.89);
            cherryTree(-5.88, 14.42, 0.64);
            try {
                for (var _f = __values([[10.92, 7.2, 1.32, 1.1], [-7.41, 7.67, 2, 0.56], [-5.41, -0.39, 1.23, 0.5], [7.21, -7.03, 1.21, 0.8], [9.71, 1.6, 1.82, 0.62], [-11.48, 6.95, 1.43, 0.72], [-5.81, 13.55, 1.25, 0.69], [10.34, -15.13, 1.2, 0.54]]), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 4), x = _h[0], z = _h[1], w = _h[2], d = _h[3];
                    block(parent, stone, x, 0.287, z, w, 0.215, d);
                    block(parent, soil, x, 0.402, z, w - 0.09, 0.019, d - 0.09, false);
                    for (var i = 0; i < 23; i++) {
                        var sx = 0.08 + rng() * 0.22;
                        leaf(green[Math.floor(rng() * green.length)], x + (rng() - 0.5) * (w - 0.19), 0.43 + rng() * 0.22, z + (rng() - 0.5) * (d - 0.19), sx, sx * 0.74, sx);
                    }
                }
            }
            catch (e_46_1) { e_46 = { error: e_46_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                }
                finally { if (e_46) throw e_46.error; }
            }
            var _loop_7 = function (finish, matrices) {
                var instances = new THREE.InstancedMesh(leafGeometry, finish, matrices.length);
                matrices.forEach(function (matrix3, index) { return instances.setMatrixAt(index, matrix3); });
                instances.castShadow = instances.receiveShadow = true;
                parent.add(instances);
            };
            try {
                for (var leaves_1 = __values(leaves), leaves_1_1 = leaves_1.next(); !leaves_1_1.done; leaves_1_1 = leaves_1.next()) {
                    var _j = __read(leaves_1_1.value, 2), finish = _j[0], matrices = _j[1];
                    _loop_7(finish, matrices);
                }
            }
            catch (e_47_1) { e_47 = { error: e_47_1 }; }
            finally {
                try {
                    if (leaves_1_1 && !leaves_1_1.done && (_e = leaves_1.return)) _e.call(leaves_1);
                }
                finally { if (e_47) throw e_47.error; }
            }
            var petal = new THREE.InstancedMesh(new THREE.CircleGeometry(0.035, 5), new THREE.MeshBasicMaterial({ color: "#dea29e", side: THREE.DoubleSide }), 135);
            var matrix2 = new THREE.Matrix4();
            for (var i = 0; i < petal.count; i++) {
                var _k = __read([[10.42, -6.8], [-10, -6.28], [-4.56, 12.25]][i % 3], 2), cx = _k[0], cz = _k[1];
                var x = THREE.MathUtils.clamp(cx + (rng() - 0.5) * 5.7, -SITE_HALF_WIDTH + 0.08, SITE_HALF_WIDTH - 0.08);
                var z = THREE.MathUtils.clamp(cz + (rng() - 0.5) * 6.4, SITE_BACK + 0.06, SITE_FRONT - 0.06);
                var paved = x < ROAD_LEFT || x > ROAD_RIGHT && (z < DRIVEWAY_BACK || z > DRIVEWAY_FRONT);
                matrix2.makeRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, rng() * 6));
                matrix2.setPosition(x, paved ? 0.181 : 0.013, z);
                petal.setMatrixAt(i, matrix2);
            }
            parent.add(petal);
        }
        function buildPetals(parent) {
            var rng = randomFrom(6241);
            var shape = new THREE.Shape();
            shape.moveTo(0, -0.072);
            shape.bezierCurveTo(-0.075, -0.01, -0.044, 0.088, -9e-3, 0.069);
            shape.lineTo(7e-3, 0.049);
            shape.bezierCurveTo(0.052, 0.096, 0.074, 1e-3, 0, -0.072);
            var finish = new THREE.MeshBasicMaterial({ color: 16777215, side: THREE.DoubleSide, transparent: true, opacity: 0.87 });
            var mesh = new THREE.InstancedMesh(new THREE.ShapeGeometry(shape, 4), finish, 57);
            mesh.frustumCulled = false;
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            var lastTime = NaN;
            var dummy = new THREE.Object3D();
            var colors = ["#f4b8af", "#ffd5be", "#f5a1ac", "#f9ccb4"];
            var particles = Array.from({ length: mesh.count }, function (_, i) {
                mesh.setColorAt(i, new THREE.Color(colors[i % colors.length]));
                return { x: rng() * (SITE_WIDTH - 1) - SITE_HALF_WIDTH + 0.5, y: rng() * 8, z: SITE_BACK + 0.7 + rng() * (SITE_LENGTH - 1.4), rate: 0.37 + rng() * 0.5, phase: rng() * 6, size: 0.56 + rng() * 0.64 };
            });
            parent.add(mesh);
            return function (seconds, visibility) {
                if (visibility === void 0) { visibility = 1; }
                mesh.visible = visibility > 0.01;
                finish.opacity = 0.87 * visibility;
                if (!mesh.visible || seconds === lastTime)
                    return;
                lastTime = seconds;
                for (var i = 0; i < particles.length; i++) {
                    var _d = particles[i], x = _d.x, y = _d.y, z = _d.z, rate = _d.rate, phase = _d.phase, size = _d.size;
                    var sway = seconds * 1.15 + phase;
                    dummy.position.set(THREE.MathUtils.euclideanModulo(x + seconds * 0.28 + Math.sin(sway) * 0.58 + SITE_HALF_WIDTH - 0.25, SITE_WIDTH - 0.5) - SITE_HALF_WIDTH + 0.25, THREE.MathUtils.euclideanModulo(y - seconds * rate, 8) + 0.18, z + Math.cos(sway * 0.7) * 0.53);
                    dummy.rotation.set(sway * 0.82, sway * 0.58, sway * 1.12);
                    dummy.scale.setScalar(size);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            };
        }
        var EVENING_SUN = new THREE.Vector3(-26, 12, -18);
        var LOOK = {
            exposure: [1.12, 1.1],
            sunColor: ["#ffc795", "#c6d8e5"],
            sunIntensity: [2.95, 0.16],
            sunSoftness: [1, 3.4],
            skyFill: ["#a8bde2", "#a9c4dc"],
            groundFill: ["#5f5468", "#5d7283"],
            fillIntensity: [1.05, 1.1],
            bounce: [0.38, 0.5],
            environment: [0.46, 0.6],
            fogColor: ["#b2bed0", "#96adbf"],
            fogDensity: [36e-4, 76e-4],
            practicals: [1, 1.12],
            bloomStrength: [0.3, 0.36],
            bloomThreshold: [1.1, 1.02],
            occlusion: [0.92, 0.86],
            sunShafts: [62e-4, 0],
            lampHalos: [0.01, 0.03],
            asphaltRoughness: [0.92, 0.62],
            asphaltClearcoat: [0.55, 1],
            asphaltCoatRoughness: [1, 0.62]
        };
        function paintEveningSky() {
            return paintedTexture(1200, 820, function (ctx, w, h) {
                var e_49, _d, e_50, _e;
                var gradient = ctx.createLinearGradient(0, 0, w * 0.12, h);
                try {
                    for (var _f = __values([[0, "#394e70"], [0.25, "#6c7f9d"], [0.44, "#a5adc7"], [0.59, "#dbc0cd"], [0.76, "#c1b2c7"], [1, "#7e98b0"]]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var _h = __read(_g.value, 2), height = _h[0], tint = _h[1];
                        gradient.addColorStop(height, tint);
                    }
                }
                catch (e_49_1) { e_49 = { error: e_49_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_49) throw e_49.error; }
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
                var twilight = ctx.createRadialGradient(w * 0.17, h * 0.43, 5, w * 0.16, h * 0.49, w * 0.48);
                twilight.addColorStop(0, "#ffe4bfc9");
                twilight.addColorStop(0.31, "#ffc9ac91");
                twilight.addColorStop(0.65, "#eaa8aa26");
                twilight.addColorStop(1, "#e8969900");
                ctx.fillStyle = twilight;
                ctx.fillRect(0, 0, w, h);
                var cloudCanvas = document.createElement("canvas");
                cloudCanvas.width = 600;
                cloudCanvas.height = 410;
                var cloudContext = cloudCanvas.getContext("2d");
                var pixels = cloudContext.createImageData(600, 410);
                function hash(x, y) {
                    var v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
                    return v - Math.floor(v);
                }
                function noise(x, y) {
                    var ix = Math.floor(x), iy = Math.floor(y);
                    var fx = x - ix, fy = y - iy;
                    fx = fx * fx * (3 - 2 * fx);
                    fy = fy * fy * (3 - 2 * fy);
                    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), fx), THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx), fy);
                }
                for (var y = 0; y < 410; y++)
                    for (var x = 0; x < 600; x++) {
                        var u = x / 600, v = y / 410;
                        var field = noise(u * 4, v * 12) * 0.56 + noise(u * 9 + 17, v * 26) * 0.28 + noise(u * 23, v * 49) * 0.16;
                        var band = Math.exp(-Math.pow((v - 0.29 - u * 0.075) / 0.105, 2)) + 0.45 * Math.exp(-Math.pow((v - 0.46 + u * 0.035) / 0.05, 2));
                        var density = THREE.MathUtils.smoothstep(field, 0.46, 0.75) * band;
                        var highlight = THREE.MathUtils.clamp((field - noise(u * 4, (v - 0.01) * 12)) * 0.9 + 0.32, 0, 1);
                        var i = (y * 600 + x) * 4;
                        pixels.data[i] = 117 + highlight * 137;
                        pixels.data[i + 1] = 119 + highlight * 91;
                        pixels.data[i + 2] = 161 + highlight * 49;
                        pixels.data[i + 3] = density * 136;
                    }
                cloudContext.putImageData(pixels, 0, 0);
                ctx.drawImage(cloudCanvas, 0, 0, w, h);
                try {
                    for (var _j = __values([[0.73, 0.12, 0.9], [0.82, 0.172, 0.69], [0.929, 0.093, 0.75], [0.911, 0.225, 0.58], [0.58, 0.18, 0.57], [0.48, 0.1, 0.49], [0.664, 0.235, 0.53], [0.27, 0.15, 0.52]]), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var _l = __read(_k.value, 3), x = _l[0], y = _l[1], r = _l[2];
                        ctx.fillStyle = "#f6e5dfb2";
                        ctx.beginPath();
                        ctx.arc(x * w, y * h, r, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
                catch (e_50_1) { e_50 = { error: e_50_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                    }
                    finally { if (e_50) throw e_50.error; }
                }
            });
        }
        function makeEveningEnvironment(renderer2, rainy) {
            if (rainy === void 0) { rainy = false; }
            var w = 512, h = 256, pixels = new Float32Array(w * h * 4);
            var upper = new THREE.Color(rainy ? "#8da8bc" : "#8899ba"), horizon = new THREE.Color(rainy ? "#bac9d2" : "#c8bacb");
            var lower = new THREE.Color(rainy ? "#526273" : "#535465"), sunTint = new THREE.Color("#ffe1c4");
            var direction = EVENING_SUN.clone().normalize();
            var sample = new THREE.Vector3(), color = new THREE.Color();
            for (var y = 0; y < h; y++)
                for (var x = 0; x < w; x++) {
                    var elevation = ((y + 0.5) / h - 0.5) * Math.PI;
                    var azimuth = ((x + 0.5) / w - 0.5) * Math.PI * 2;
                    var cos = Math.cos(elevation);
                    sample.set(Math.cos(azimuth) * cos, Math.sin(elevation), Math.sin(azimuth) * cos);
                    if (sample.y >= 0)
                        color.copy(horizon).lerp(upper, Math.pow(sample.y, 0.46));
                    else
                        color.copy(horizon).lerp(lower, Math.min(1, -sample.y * 3.5));
                    var alignment = sample.dot(direction);
                    var glow = rainy ? 0 : Math.exp((alignment - 1) * 6) * 0.3 + Math.exp((alignment - 1) * 48) * 1.1;
                    var disk = rainy ? 0 : Math.exp((alignment - 1) * 15e3) * 4;
                    color.r += sunTint.r * (glow + disk);
                    color.g += sunTint.g * (glow + disk);
                    color.b += sunTint.b * (glow + disk);
                    var i = (y * w + x) * 4;
                    pixels[i] = color.r;
                    pixels[i + 1] = color.g;
                    pixels[i + 2] = color.b;
                    pixels[i + 3] = 1;
                }
            var sky2 = new THREE.DataTexture(pixels, w, h, THREE.RGBAFormat, THREE.FloatType);
            sky2.colorSpace = THREE.LinearSRGBColorSpace;
            sky2.needsUpdate = true;
            sky2.mapping = THREE.EquirectangularReflectionMapping;
            var generator = new THREE.PMREMGenerator(renderer2);
            var environment2 = generator.fromEquirectangular(sky2);
            generator.dispose();
            sky2.dispose();
            return environment2.texture;
        }
        var roadWetnessCanvas = null;
        function roadWetness() {
            if (roadWetnessCanvas)
                return roadWetnessCanvas;
            var canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 1536;
            paintRoadWetness(canvas.getContext("2d"), canvas.width, canvas.height);
            return roadWetnessCanvas = canvas;
        }
        function paintRoadWetness(ctx, w, h) {
            var e_51, _d;
            var random = randomFrom(623);
            var width = ROAD_RIGHT - ROAD_LEFT;
            function streak(x, z, rx, rz, strength) {
                ctx.save();
                ctx.translate((x - ROAD_LEFT) / width * w, (z - SITE_BACK) / SITE_LENGTH * h);
                ctx.scale(rx * w / width, rz * h / SITE_LENGTH);
                var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
                gradient.addColorStop(0, "rgba(255,255,255,".concat(strength, ")"));
                gradient.addColorStop(0.49, "rgba(255,255,255,".concat(strength * 0.68, ")"));
                gradient.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = gradient;
                ctx.fillRect(-1, -1, 2, 2);
                ctx.restore();
            }
            try {
                for (var _e = __values([[4.18, 2, 0.7, 3.1], [0.32, -0.2, 0.9, 3.1], [0.32, 6.5, 0.81, 2.65], [2.3, 8.1, 1.02, 2.8], [3.12, -9.9, 1.44, 2.54], [1.5, -6.23, 1, 2.56], [4.47, 12.4, 0.43, 1.6], [0.02, 11.5, 0.49, 1.9]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var _g = __read(_f.value, 4), x = _g[0], z = _g[1], rx = _g[2], rz = _g[3];
                    streak(x, z, rx, rz, 0.8);
                    for (var n = 0; n < 11; n++) {
                        streak(x + (random() - 0.5) * rx * 1.65, z + (random() - 0.5) * rz * 1.68, rx * (0.18 + random() * 0.4), rz * (0.08 + random() * 0.26), 0.19 + random() * 0.32);
                    }
                }
            }
            catch (e_51_1) { e_51 = { error: e_51_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_51) throw e_51.error; }
            }
            for (var i = 0; i < 2300; i++) {
                ctx.globalCompositeOperation = random() > 0.24 ? "destination-out" : "source-atop";
                ctx.fillStyle = "rgba(255,255,255,".concat(random() * 0.54, ")");
                ctx.fillRect(random() * w, random() * h, 1 + random() * 3, 1 + random() * 5);
            }
        }
        function wetAsphaltMap() {
            return paintedTexture(128, 1044, function (ctx, w, h) {
                ctx.fillStyle = "rgb(89,219,0)";
                ctx.fillRect(0, 0, w, h);
                var patch = document.createElement("canvas");
                patch.width = 512;
                patch.height = 1536;
                var patchContext = patch.getContext("2d");
                patchContext.drawImage(roadWetness(), 0, 0);
                patchContext.globalCompositeOperation = "source-in";
                patchContext.fillStyle = "rgb(255,46,0)";
                patchContext.fillRect(0, 0, patch.width, patch.height);
                var length = STREET_FRONT - STREET_BACK;
                ctx.drawImage(patch, 0, h * (SITE_BACK - STREET_BACK) / length, w, h * SITE_LENGTH / length);
            });
        }
        function buildPuddles(parent) {
            var wetMask = new THREE.CanvasTexture(roadWetness());
            wetMask.colorSpace = THREE.SRGBColorSpace;
            wetMask.anisotropy = 8;
            var surface = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms: {
                    wetMask: { value: wetMask },
                    reflection: { value: null },
                    reflectionMatrix: { value: new THREE.Matrix4() },
                    rainAmount: { value: 0 },
                    rainTime: { value: 0 }
                },
                vertexShader: "\n          uniform mat4 reflectionMatrix;\n          varying vec4 reflected;\n          varying vec2 pavement;\n          void main() {\n            vec4 world = modelMatrix * vec4(position, 1.0);\n            reflected = reflectionMatrix * world;\n            pavement = uv;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n          }",
                fragmentShader: "\n          uniform sampler2D wetMask;\n          uniform sampler2D reflection;\n          uniform float rainAmount;\n          uniform float rainTime;\n          varying vec4 reflected;\n          varying vec2 pavement;\n          void main() {\n            float wet = texture2D(wetMask,pavement).a;\n            wet=mix(wet,max(wet,0.30),rainAmount);\n            wet*=smoothstep(0.0,0.045,pavement.y)*(1.0-smoothstep(0.95,1.0,pavement.y));\n            if (wet < 0.009) discard;\n            vec2 at = reflected.xy / reflected.w * 0.5 + 0.5;\n            if (any(lessThan(at,vec2(0.005))) || any(greaterThan(at,vec2(0.995)))) discard;\n            // Broken microfacets spread the reflected signs into brief streaks.\n            float ripple = sin(pavement.y * 490.0 + sin(pavement.x * 88.0 + rainTime*rainAmount*1.8) * 1.9) * (0.0014+rainAmount*0.0012);\n            vec2 edge = vec2(0.0014 + 0.0015 * wet, 0.0035);\n            at += vec2(ripple, ripple * 0.55);\n            vec3 color = texture2D(reflection,at).rgb * 0.38;\n            color += (texture2D(reflection,at+edge).rgb+texture2D(reflection,at-edge).rgb) * 0.20;\n            color += (texture2D(reflection,at+edge*vec2(1.8,-2.0)).rgb+texture2D(reflection,at-edge*vec2(1.8,-2.0)).rgb) * 0.11;\n            gl_FragColor = vec4(color * vec3(0.86,0.90,0.97), wet * mix(0.36,0.62,rainAmount));\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n          }"
            });
            var wetBounds = { left: ROAD_LEFT, right: ROAD_RIGHT, back: SITE_BACK, front: SITE_FRONT };
            var geometry = groundGrid([ROAD_LEFT, ROAD_CENTER, ROAD_RIGHT], [SITE_BACK, SITE_FRONT], wetBounds, function (x) { return roadHeight(x) + 4e-3; });
            var puddles = new THREE.Mesh(geometry, surface);
            puddles.name = "Wet asphalt reflections";
            parent.add(puddles);
            return puddles;
        }
        function makeRoadReflection(renderer2, scene, puddles, camera) {
            var target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
            target.scissorTest = true;
            var mirror = camera.clone();
            var aim = new THREE.Vector3();
            var reflectedUp = new THREE.Vector3();
            var projected = new THREE.Vector3();
            var roadCorners = [ROAD_LEFT, ROAD_CENTER, ROAD_RIGHT].flatMap(function (x) { return [SITE_BACK, SITE_FRONT].map(function (z) { return [x, z]; }); });
            var clipping = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.05)];
            puddles.material.uniforms.reflection.value = target.texture;
            function cropToRoad(projection) {
                var e_52, _d;
                var minX = 1, minY = 1, maxX = -1, maxY = -1;
                try {
                    for (var roadCorners_1 = __values(roadCorners), roadCorners_1_1 = roadCorners_1.next(); !roadCorners_1_1.done; roadCorners_1_1 = roadCorners_1.next()) {
                        var _e = __read(roadCorners_1_1.value, 2), x = _e[0], z = _e[1];
                        projected.set(x, roadHeight(x) + 4e-3, z).applyMatrix4(projection);
                        minX = Math.min(minX, projected.x);
                        minY = Math.min(minY, projected.y);
                        maxX = Math.max(maxX, projected.x);
                        maxY = Math.max(maxY, projected.y);
                    }
                }
                catch (e_52_1) { e_52 = { error: e_52_1 }; }
                finally {
                    try {
                        if (roadCorners_1_1 && !roadCorners_1_1.done && (_d = roadCorners_1.return)) _d.call(roadCorners_1);
                    }
                    finally { if (e_52) throw e_52.error; }
                }
                var border = 0.012;
                var left = Math.max(0, Math.floor(target.width * (minX * 0.5 + 0.5 - border)) - 1);
                var bottom = Math.max(0, Math.floor(target.height * (minY * 0.5 + 0.5 - border)) - 1);
                var right = Math.min(target.width, Math.ceil(target.width * (maxX * 0.5 + 0.5 + border)) + 1);
                var top = Math.min(target.height, Math.ceil(target.height * (maxY * 0.5 + 0.5 + border)) + 1);
                if (right <= left || top <= bottom)
                    return false;
                target.scissor.set(left, bottom, right - left, top - bottom);
                return true;
            }
            return {
                resize: function (width, height) {
                    var scale = Math.min(0.46, 640 / width, 460 / height);
                    target.setSize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
                },
                render: function () {
                    if (camera.position.y <= 0.015) {
                        puddles.visible = false;
                        return;
                    }
                    mirror.position.copy(camera.position);
                    mirror.position.y = 0.022 - mirror.position.y;
                    camera.getWorldDirection(aim);
                    aim.y *= -1;
                    reflectedUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
                    reflectedUp.y *= -1;
                    mirror.up.copy(reflectedUp);
                    mirror.lookAt(aim.add(mirror.position));
                    mirror.updateMatrixWorld(true);
                    mirror.projectionMatrix.copy(camera.projectionMatrix);
                    var projection = puddles.material.uniforms.reflectionMatrix.value;
                    projection.multiplyMatrices(mirror.projectionMatrix, mirror.matrixWorldInverse);
                    if (!cropToRoad(projection)) {
                        puddles.visible = false;
                        return;
                    }
                    var previousTarget = renderer2.getRenderTarget();
                    var previousClipping = renderer2.clippingPlanes;
                    var previousShadows = renderer2.shadowMap.autoUpdate;
                    renderer2.clippingPlanes = clipping;
                    renderer2.shadowMap.autoUpdate = false;
                    puddles.visible = false;
                    renderer2.setRenderTarget(target);
                    renderer2.render(scene, mirror);
                    renderer2.setRenderTarget(previousTarget);
                    renderer2.clippingPlanes = previousClipping;
                    renderer2.shadowMap.autoUpdate = previousShadows;
                    puddles.visible = true;
                }
            };
        }
        var railMistGLSL = "\n      float railMistDepth(vec3 surface, vec3 towardCamera, float viewDepth) {\n        float outside = abs(surface.x) - atmosphereBounds.x;\n        float perimeter = smoothstep(0.0, 4.6, outside);\n        if (perimeter <= 0.0) return 0.0;\n        float start = atmosphereBounds.x + 1.15;\n        float width = railMistEnd - start;\n        float total = 0.0;\n        for (int side = -1; side <= 1; side += 2) {\n          float direction = float(side);\n          float x = surface.x * direction;\n          float dx = towardCamera.x * direction;\n          // Slab limits restrict the samples to the exterior, including views\n          // looking almost directly across the tracks.\n          float reach = min(viewDepth, 20.0);\n          float near = 0.0;\n          float far = reach;\n          if (abs(dx) > 0.0001) {\n            float a = (start - x) / dx;\n            float b = (railMistEnd + 5.0 - x) / dx;\n            near = max(near, min(a, b));\n            far = min(far, max(a, b));\n          } else if (x < start || x > railMistEnd + 5.0) {\n            continue;\n          }\n          if (far <= near) continue;\n          float stepSize = (far - near) / 8.0;\n          float depth = 0.0;\n          for (int sampleIndex = 0; sampleIndex < 8; sampleIndex++) {\n            vec3 p = surface + towardCamera * (near + (float(sampleIndex) + 0.5) * stepSize);\n            float outward = (p.x * direction - start) / width;\n            float drift = 0.28 * sin(p.z * 0.32 + p.y * 0.38)\n                        + 0.13 * sin(p.z * 0.69 - p.x * 0.23);\n            float across = abs(p.z - railMistZ + drift);\n            float height = p.y + 0.40 * sin(p.z * 0.23);\n            float envelope = (1.0 - smoothstep(3.8, 14.0, across))\n                           * (1.0 - smoothstep(8.7, 15.5, height));\n            float exterior = clamp(outward, 0.0, 1.15);\n            float shoulder = 1.0 - smoothstep(railMistEnd + 2.0, railMistEnd + 5.0, p.x * direction);\n            depth += exterior * exterior * envelope * shoulder;\n          }\n          total += depth * stepSize * 2.7;\n        }\n        // Keep the distant cut inside the dense part of the layer at grazing angles.\n        float deepExterior = smoothstep(0.0, width, outside - 1.15);\n        float edgeDepth = 5.0 * deepExterior * deepExterior * deepExterior\n                        * (1.0 - smoothstep(4.0, 14.0, abs(surface.z - railMistZ)))\n                        * (1.0 - smoothstep(8.7, 15.5, surface.y));\n        return total * perimeter + edgeDepth;\n      }\n    ";
        var localLighting = THREE.ShaderChunk.lights_fragment_begin.replace(/pointLight = pointLights\[ i \];([\s\S]*?)(\n\t\}\n\t#pragma unroll_loop_end)/, "pointLight = pointLights[ i ];\n        toPointLight = pointLight.position - geometryPosition;\n        if (pointLight.distance <= 0.0 || dot(toPointLight,toPointLight) < pointLight.distance * pointLight.distance) {\n          $1\n        }$2").replace("PointLight pointLight;", "PointLight pointLight;\n	vec3 toPointLight;");
        var tramLocalLighting = localLighting.replace(/(directLight\.color \*= \( directLight\.visible && receiveShadow \) \? )(getShadow\( directionalShadowMap\[ i \],[^\n]*?\))( : 1\.0;)/, "#if UNROLLED_LOOP_INDEX == 0\n        $1min($2, tramSunVisibility(tramShadowCoord,atmosphereWorld.y,directionalLightShadow.shadowIntensity))$3\n      #else\n        $1$2$3\n      #endif");
        var tramShadowFragment = "\n      #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n        varying vec3 tramShadowCoord;\n        uniform highp sampler2DShadow tramDepth;\n        uniform vec2 tramShadowScale;\n        uniform float tramShadowBias;\n        uniform float tramShadowOpacity;\n        uniform float tramShadowSoftness;\n\n        float tramSunVisibility(vec3 coord,float height,float intensity) {\n          if (tramShadowOpacity < 0.001 || any(lessThan(coord,vec3(0.0))) ||\n              any(greaterThan(coord,vec3(1.0)))) return 1.0;\n          coord.z -= tramShadowBias;\n          // A small fixed tent filter stays in light space as the car moves.\n          // Its radius grows on the street below the elevated train.\n          float radius=(0.012+0.013*max(0.0,5.22-height))*tramShadowSoftness;\n          vec2 stepUV=radius*tramShadowScale;\n          float lit=0.0;\n          for(int row=-1;row<=1;row++) for(int col=-1;col<=1;col++) {\n            vec2 tap=vec2(float(col),float(row));\n            float weight=(2.0-abs(tap.x))*(2.0-abs(tap.y));\n            lit+=weight*texture(tramDepth,vec3(coord.xy+tap*stepUV,coord.z));\n          }\n          return mix(1.0,lit/16.0,tramShadowOpacity*intensity);\n        }\n      #endif\n    ";
        function applyAtmosphericFalloff(scene, renderer2, tramHeadlightX, occlusion, tramShadows) {
            var viewport = new THREE.Vector2();
            renderer2.getDrawingBufferSize(viewport);
            var uniforms = {
                atmosphereSky: { value: scene.background },
                yunagiWorldToLocal: { value: new THREE.Matrix4() },
                atmosphereSize: { value: viewport },
                atmosphereBounds: { value: new THREE.Vector3(SITE_HALF_WIDTH, SITE_LENGTH / 2, SITE_CENTER_Z) },
                atmosphereEnabled: { value: 1 },
                atmosphereRain: { value: 0 },
                railMistEnd: { value: SITE_HALF_WIDTH + RAIL_APPROACH_LENGTH },
                railMistZ: { value: RAIL_CENTER_Z },
                tramHeadlightX: tramHeadlightX
            };
            var visited = new Set();
            scene.traverse(function (object) {
                var e_53, _d;
                if (!object.isMesh || object.userData.skipAtmosphere)
                    return;
                var materials = Array.isArray(object.material) ? object.material : [object.material];
                var _loop_8 = function (finish) {
                    if (visited.has(finish) || !(finish.isMeshStandardMaterial || finish.isMeshBasicMaterial))
                        return "continue";
                    visited.add(finish);
                    var previous = finish.onBeforeCompile;
                    var cacheKey = finish.customProgramCacheKey();
                    var distantNeighborhood = Boolean(finish.userData.distantNeighborhood);
                    var railPass = finish.userData.railMistPass;
                    var headlightReceiver = finish.userData.headlightReceiver;
                    var tramReceiver = Boolean(tramShadows == null ? void 0 : tramShadows.receivers.has(finish));
                    var receivesTramShadow = Boolean(tramShadows) && finish.isMeshStandardMaterial;
                    var occluded = Boolean(occlusion) && finish.isMeshStandardMaterial && !tramReceiver;
                    finish.onBeforeCompile = function (shader) {
                        previous.call(finish, shader, renderer2);
                        Object.assign(shader.uniforms, uniforms);
                        if (occluded)
                            Object.assign(shader.uniforms, occlusion);
                        if (receivesTramShadow)
                            Object.assign(shader.uniforms, tramShadows.uniforms);
                        if (headlightReceiver)
                            shader.uniforms.tramHeadlightStrength = { value: headlightReceiver };
                        shader.vertexShader = shader.vertexShader.replace("#include <common>", "\n              #include <common>\n              uniform mat4 yunagiWorldToLocal; varying vec3 atmosphereWorld;\n              varying vec2 railMistUV;\n              ".concat(receivesTramShadow ? "\n                #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n                  uniform mat4 tramShadowMatrix;\n                  varying vec3 tramShadowCoord;\n                #endif" : "", "\n            ")).replace("#include <project_vertex>", "\n              #include <project_vertex>\n              railMistUV = gl_Position.xy / gl_Position.w * 0.5 + 0.5;\n              vec4 atmospherePosition = vec4(transformed,1.0);\n              #ifdef USE_BATCHING\n                atmospherePosition = batchingMatrix * atmospherePosition;\n              #endif\n              #ifdef USE_INSTANCING\n                atmospherePosition = instanceMatrix * atmospherePosition;\n              #endif\n              atmosphereWorld = (yunagiWorldToLocal * modelMatrix * atmospherePosition).xyz;\n              ".concat(receivesTramShadow ? "\n                #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n                  vec3 tramReceiverNormal=inverseTransformDirection(transformedNormal,viewMatrix);\n                  tramShadowCoord=(tramShadowMatrix*vec4(atmosphereWorld+0.014*tramReceiverNormal,1.0)).xyz;\n                #endif" : "", "\n            "));
                        shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", receivesTramShadow ? tramLocalLighting : localLighting).replace("#include <common>", "\n              #include <common>\n              ".concat(tramReceiver ? "#define TRAM_STABLE_SHADOW 1" : "", "\n              uniform mat4 yunagiWorldToLocal; varying vec3 atmosphereWorld;\n              varying vec2 railMistUV;\n              uniform sampler2D atmosphereSky;\n              uniform vec2 atmosphereSize;\n              uniform vec3 atmosphereBounds;\n              uniform float atmosphereEnabled;\n              uniform float atmosphereRain;\n              uniform float railMistEnd;\n              uniform float railMistZ;\n              ").concat(headlightReceiver ? "uniform float tramHeadlightX; uniform float tramHeadlightStrength;" : "", "\n              ").concat(railMistGLSL, "\n              ").concat(receivesTramShadow ? tramShadowFragment : "", "\n            ")).replace("#include <alphatest_fragment>", "\n              ".concat(railPass ? "\n                float railExterior = abs(atmosphereWorld.x) - atmosphereBounds.x;\n                ".concat(railPass === "exterior" ? "if (railExterior <= 1.8 || abs(atmosphereWorld.x) >= railMistEnd) discard;" : "if (railExterior > 1.8) discard;", "\n              ") : "", "\n              #include <alphatest_fragment>\n            "));
                        if (headlightReceiver) {
                            shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", "\n                float ahead = atmosphereWorld.x - tramHeadlightX;\n                if (atmosphereRain > 0.001 && ahead > 0.05 && ahead < 5.1 && atmosphereWorld.y > 5.17) {\n                  float trackOffset = abs(abs(atmosphereWorld.z-railMistZ)-0.444);\n                  float across = trackOffset / (0.13 + ahead * 0.09);\n                  float along = smoothstep(0.05,1.2,ahead)*(1.0-smoothstep(1.5,5.1,ahead));\n                  float edge = 1.0-smoothstep(railMistEnd-4.0,railMistEnd,abs(atmosphereWorld.x));\n                  float glint = along * exp(-2.8*across*across) * edge * atmosphereRain;\n                  outgoingLight += vec3(1.0,0.58,0.26) * glint * tramHeadlightStrength;\n                }\n                #include <opaque_fragment>\n              ");
                        }
                        if (occluded) {
                            shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\n                uniform sampler2D screenOcclusionMap;\n                uniform mat4 screenOcclusionViewProjection;\n                uniform float screenOcclusionStrength;\n              ").replace("#include <aomap_fragment>", "#include <aomap_fragment>\n                if (atmosphereEnabled > 0.0 && screenOcclusionStrength > 0.0) {\n                  vec4 occlusionClip = screenOcclusionViewProjection * vec4(atmosphereWorld, 1.0);\n                  vec2 occlusionUv = clamp(occlusionClip.xy / occlusionClip.w * 0.5 + 0.5, 0.0, 1.0);\n                  float screenOcclusion = mix(1.0, texture2D(screenOcclusionMap, occlusionUv).r, screenOcclusionStrength);\n                  reflectedLight.indirectDiffuse *= screenOcclusion;\n                  reflectedLight.indirectSpecular *= screenOcclusion;\n                }\n              ");
                        }
                        shader.fragmentShader = shader.fragmentShader.replace("#include <fog_fragment>", "\n              #include <fog_fragment>\n              // Low mist thickens toward the perimeter. The same sky texture makes\n              // the outer ground and soil dissolve smoothly into the evening air.\n              vec2 district = abs(vec2(atmosphereWorld.x/atmosphereBounds.x, (atmosphereWorld.z-atmosphereBounds.z)/atmosphereBounds.y));\n              float boundary = max(district.x,district.y);\n              // Inside this bound every component of the perimeter fog is zero.\n              if (atmosphereEnabled > 0.0 ".concat(distantNeighborhood ? "" : "&& (boundary > 0.68 || atmosphereWorld.y < 0.04)", ") {\n                float mistDrift=0.024*sin(atmosphereWorld.x*0.43+atmosphereWorld.z*0.31)+0.015*sin(atmosphereWorld.z*0.73-atmosphereWorld.x*0.19);\n                float edgeMist = smoothstep(0.72,1.08,boundary+mistDrift);\n                float heightDensity = exp(-max(atmosphereWorld.y-0.17,0.0)*0.87);\n                float belowStreet = 1.0-smoothstep(-0.88,0.04,atmosphereWorld.y);\n                float outerAir = smoothstep(1.04,2.9,boundary)*mix(0.76,0.91,atmosphereRain);\n                float outerGround = smoothstep(0.98,1.19,boundary)*exp(-max(atmosphereWorld.y-0.18,0.0)*2.8);\n                float fogWeight = max(max(edgeMist*heightDensity,belowStreet*0.995),outerGround);\n                fogWeight = 1.0-(1.0-fogWeight)*(1.0-outerAir);\n                ").concat(distantNeighborhood ? "float neighborhoodHaze=0.74+0.245*smoothstep(1.05,2.35,boundary); fogWeight=1.0-(1.0-fogWeight)*(1.0-neighborhoodHaze);" : "", "\n                vec2 pixel = 1.0 / atmosphereSize;\n                vec3 skyColor = linearToOutputTexel(textureGrad(atmosphereSky,gl_FragCoord.xy*pixel,\n                  vec2(pixel.x,0.0),vec2(0.0,pixel.y))).rgb;\n                gl_FragColor.rgb = mix(gl_FragColor.rgb,skyColor,clamp(fogWeight,0.0,1.0));\n              }\n              float railFogDepth = 0.0;\n              if (district.x > 1.0) {\n                vec3 towardCamera = vec3(viewMatrix[0].z, viewMatrix[1].z, viewMatrix[2].z);\n                float viewDepth = dot((yunagiWorldToLocal*vec4(cameraPosition,1.0)).xyz - atmosphereWorld, towardCamera);\n                railFogDepth = railMistDepth(atmosphereWorld, towardCamera, viewDepth);\n                float railFog = (1.0 - exp(-railFogDepth * 0.19))").concat(railPass ? " * 0.22" : "", ";\n                if (railFog >= 0.001) {\n                  vec3 mist = linearToOutputTexel(texture2D(atmosphereSky,railMistUV)).rgb;\n                  gl_FragColor.rgb = mix(gl_FragColor.rgb,mist,railFog);\n                }\n              }\n              ").concat(railPass === "exterior" ? "\n                float farEnd = railMistEnd - atmosphereBounds.x;\n                float reach = smoothstep(1.8, farEnd, railExterior);\n                gl_FragColor.a *= exp(-railFogDepth * 0.13 * reach) * (1.0 - reach * reach);\n              " : "", "\n            "));
                    };
                    finish.customProgramCacheKey = function () { return "".concat(cacheKey, "/district-approach-haze/").concat(distantNeighborhood, "/").concat(railPass != null ? railPass : "default", "/").concat(Boolean(headlightReceiver), "/").concat(occluded, "/").concat(receivesTramShadow, "/").concat(tramReceiver); };
                    finish.needsUpdate = true;
                };
                try {
                    for (var materials_1 = __values(materials), materials_1_1 = materials_1.next(); !materials_1_1.done; materials_1_1 = materials_1.next()) {
                        var finish = materials_1_1.value;
                        _loop_8(finish);
                    }
                }
                catch (e_53_1) { e_53 = { error: e_53_1 }; }
                finally {
                    try {
                        if (materials_1_1 && !materials_1_1.done && (_d = materials_1.return)) _d.call(materials_1);
                    }
                    finally { if (e_53) throw e_53.error; }
                }
            });
            return {
                setWorldMatrix: function (matrix2) {
                    uniforms.yunagiWorldToLocal.value.copy(matrix2).invert();
                },
                setEnabled: function (value) {
                    uniforms.atmosphereEnabled.value = value ? 1 : 0;
                },
                setRain: function (amount) {
                    uniforms.atmosphereRain.value = amount;
                },
                resize: function () {
                    renderer2.getDrawingBufferSize(viewport);
                }
            };
        }
        function buildStreetApproaches(parent, asphalt) {
            var e_54, _d, e_55, _e, e_56, _f, e_57, _g, e_58, _h;
            var approaches = new THREE.Group();
            approaches.name = "Street approaches fading into dusk";
            parent.add(approaches);
            var sidewalk = material("#9d9daa", { roughness: 0.96 });
            try {
                for (var _j = __values([[STREET_BACK, SITE_BACK], [SITE_FRONT, STREET_FRONT]]), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var _l = __read(_k.value, 2), start = _l[0], end = _l[1];
                    var middle = (start + end) / 2;
                    var road = groundGrid([ROAD_LEFT, ROAD_CENTER, ROAD_RIGHT], [start, end], ROAD_BOUNDS, roadHeight);
                    place(approaches, road, asphalt, 0, 0, 0, false);
                    try {
                        for (var _m = (e_55 = void 0, __values([ROAD_LEFT - 1.6, ROAD_RIGHT + 1.6])), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var x = _o.value;
                            block(approaches, sidewalk, x, 0.075, middle, 3.2, 0.15, end - start, false);
                        }
                    }
                    catch (e_55_1) { e_55 = { error: e_55_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
                        }
                        finally { if (e_55) throw e_55.error; }
                    }
                    try {
                        for (var _p = (e_56 = void 0, __values([ROAD_LEFT - 0.08, ROAD_RIGHT + 0.08])), _q = _p.next(); !_q.done; _q = _p.next()) {
                            var x = _q.value;
                            block(approaches, sidewalk, x, 0.1, middle, 0.16, 0.2, end - start, false);
                        }
                    }
                    catch (e_56_1) { e_56 = { error: e_56_1 }; }
                    finally {
                        try {
                            if (_q && !_q.done && (_f = _p.return)) _f.call(_p);
                        }
                        finally { if (e_56) throw e_56.error; }
                    }
                }
            }
            catch (e_54_1) { e_54 = { error: e_54_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                }
                finally { if (e_54) throw e_54.error; }
            }
            try {
                for (var _r = __values([SITE_HALF_WIDTH + 2.4]), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var x = _s.value;
                    var apron = place(approaches, new THREE.PlaneGeometry(4.8, SITE_LENGTH), sidewalk, x, -0.025, SITE_CENTER_Z, false);
                    apron.rotation.x = -Math.PI / 2;
                }
            }
            catch (e_57_1) { e_57 = { error: e_57_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_g = _r.return)) _g.call(_r);
                }
                finally { if (e_57) throw e_57.error; }
            }
            try {
                for (var _t = __values([[-23, SITE_CENTER_Z, 18, SITE_LENGTH], [-16.8, SITE_BACK - 12.5, 26.36, 25], [15.53, SITE_BACK - 12.5, 14.94, 25]]), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var _v = __read(_u.value, 4), x = _v[0], z = _v[1], w = _v[2], d = _v[3];
                    var lane = place(approaches, new THREE.PlaneGeometry(w, d), sidewalk, x, -0.025, z, false);
                    lane.rotation.x = -Math.PI / 2;
                }
            }
            catch (e_58_1) { e_58 = { error: e_58_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_h = _t.return)) _h.call(_t);
                }
                finally { if (e_58) throw e_58.error; }
            }
            approaches.traverse(function (mesh) {
                if (mesh.isMesh)
                    mesh.receiveShadow = false;
            });
        }
        function buildContactShadows(parent) {
            var e_59, _d;
            var contact = paintedTexture(128, 128, function (ctx, w, h) {
                var image = ctx.createImageData(w, h);
                for (var y = 0; y < h; y++)
                    for (var x = 0; x < w; x++) {
                        var edge = Math.max(Math.abs(x / w - 0.5) * 2, Math.abs(y / h - 0.5) * 2);
                        var alpha = Math.pow(Math.max(0, 1 - Math.pow(edge, 5)), 1.4) * 0.34;
                        var i = (y * w + x) * 4;
                        image.data[i] = 20;
                        image.data[i + 1] = 25;
                        image.data[i + 2] = 39;
                        image.data[i + 3] = alpha * 255;
                    }
                ctx.putImageData(image, 0, 0);
            });
            var finish = new THREE.MeshBasicMaterial({ map: contact, transparent: true, depthWrite: false });
            try {
                for (var _e = __values([[-5.65, 4.35, 5.36, 5.28], [-9.1, 10.9, 6.2, 5.8], [-10.45, -11.2, 4.4, 7.4], [9.55, -11.75, 5.35, 6.3], [-5.42, -11.39, 5.44, 7.9], [-4.25, -3.2, 6.1, 3.3], [10.65, 5.12, 3.6, 3.7], [-10.59, 1.84, 4.05, 4.84]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var _g = __read(_f.value, 4), x = _g[0], z = _g[1], w = _g[2], d = _g[3];
                    var shadow = place(parent, new THREE.PlaneGeometry(w, d), finish, x, 0.179, z, false);
                    shadow.rotation.x = -Math.PI / 2;
                }
            }
            catch (e_59_1) { e_59 = { error: e_59_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_59) throw e_59.error; }
            }
        }
        function createFilmOutputPass() {
            var material2 = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: null },
                    tAir: { value: null },
                    airReady: { value: 0 },
                    sunAirColor: { value: new THREE.Color(0, 0, 0) },
                    lampAirColor: { value: new THREE.Color(0, 0, 0) },
                    shadowLift: { value: new THREE.Color(6e-3, 8e-3, 0.012) },
                    coolShadows: { value: 0.36 },
                    warmHighlights: { value: 0.55 }
                },
                vertexShader: "varying vec2 vUv;\n          void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
                fragmentShader: "uniform sampler2D tDiffuse;\n          uniform sampler2D tAir;\n          uniform float airReady;\n          uniform vec3 sunAirColor;\n          uniform vec3 lampAirColor;\n          uniform vec3 shadowLift;\n          uniform float coolShadows;\n          uniform float warmHighlights;\n          varying vec2 vUv;\n          float filmNoise(vec2 p){return fract(52.9829189*fract(dot(p,vec2(0.06711056,0.00583715))));}\n          void main(){\n            vec4 image=texture2D(tDiffuse,vUv);\n            if(airReady>0.5){\n              vec3 air=texture2D(tAir,vUv).rgb;\n              image.rgb+=air.g*sunAirColor+air.b*lampAirColor;\n            }\n            float luma=dot(image.rgb,vec3(0.2126,0.7152,0.0722));\n            vec3 color=mix(vec3(luma),image.rgb,0.99);\n            float shadows=1.0-smoothstep(0.035,0.65,luma);\n            float highlights=smoothstep(0.65,2.8,luma);\n            color+=shadowLift*(1.0-smoothstep(0.0,0.22,luma));\n            color*=mix(vec3(1.0),vec3(0.985,1.0,1.03),shadows*coolShadows);\n            color*=mix(vec3(1.0),vec3(1.045,1.006,0.958),highlights*warmHighlights);\n            vec2 edge=vUv-0.5;\n            float vignette=1.0-0.085*smoothstep(0.16,0.58,dot(edge,edge));\n            gl_FragColor=vec4(max(color,vec3(0.0))*vignette,image.a);\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n            gl_FragColor.rgb+=(filmNoise(gl_FragCoord.xy)-0.5)/255.0;\n          }",
                depthTest: false,
                depthWrite: false
            });
            var pass = new ShaderPass(material2);
            pass.needsSwap = false;
            return pass;
        }
        var SUN_DISC_RADIUS = 0.85;
        var SUN_MAX_PENUMBRA = 0.95;
        function vogelDisk(count) {
            var points = [];
            for (var i = 0; i < count; i++) {
                var radius = Math.sqrt((i + 0.5) / count);
                var angle = i * 2.39996323;
                points.push("vec2(".concat((Math.cos(angle) * radius).toFixed(6), ",").concat((Math.sin(angle) * radius).toFixed(6), ")"));
            }
            return "vec2[".concat(count, "](").concat(points.join(","), ")");
        }
        function installSoftSunShadows(shadowCamera, mapSize) {
            var chunk = THREE.ShaderChunk.shadowmap_pars_fragment;
            var pcf = /#if defined\( SHADOWMAP_TYPE_PCF \)\s+vec2 texelSize = vec2\( 1\.0 \) \/ shadowMapSize;[\s\S]*?\* \( 1\.0 \/ 17\.0 \);/;
            if (!pcf.test(chunk) || chunk.split("float getShadow(").length !== 2) {
                console.warn("Soft sun shadows unavailable: unexpected shadow chunk, keeping PCF.");
                return false;
            }
            var width = shadowCamera.right - shadowCamera.left;
            var height = shadowCamera.top - shadowCamera.bottom;
            var depthRange = shadowCamera.far - shadowCamera.near;
            var texel = Math.max(width, height) / mapSize;
            var functions = "\n        const vec2 SOFT_SUN_UV = vec2(".concat((1 / width).toFixed(8), ", ").concat((1 / height).toFixed(8), ");\n        const float SOFT_SUN_DEPTH = ").concat(depthRange.toFixed(4), ";\n        const float SOFT_SUN_SPREAD = ").concat(Math.tan(THREE.MathUtils.degToRad(SUN_DISC_RADIUS)).toFixed(6), ";\n        const float SOFT_SUN_MIN = ").concat((texel * 1.2).toFixed(5), ";\n        const float SOFT_SUN_MAX = ").concat(SUN_MAX_PENUMBRA.toFixed(4), ";\n        const float SOFT_SUN_EPSILON = ").concat((0.012 / depthRange).toFixed(7), ";\n        const vec2 SOFT_SUN_DISK[16] = ").concat(vogelDisk(16), ";\n\n        float softSunNoise() {\n          return fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));\n        }\n\n        float softSunShadow(sampler2D shadowMap, vec3 coord, float softness) {\n          // Depth gradient of the receiving surface in shadow-map space, so samples\n          // spread across sloped ground are compared against that slope.\n          vec3 ddxCoord = dFdx(coord);\n          vec3 ddyCoord = dFdy(coord);\n          float det = ddxCoord.x * ddyCoord.y - ddyCoord.x * ddxCoord.y;\n          vec2 slope = abs(det) > 1e-14\n            ? vec2(ddyCoord.y * ddxCoord.z - ddxCoord.y * ddyCoord.z,\n                   ddxCoord.x * ddyCoord.z - ddyCoord.x * ddxCoord.z) / det\n            : vec2(0.0);\n          slope = clamp(slope, vec2(-8.0), vec2(8.0));\n          #ifdef TRAM_STABLE_SHADOW\n            float angle = 0.617;\n          #else\n            float angle = 6.2831853 * softSunNoise();\n          #endif\n          mat2 spin = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));\n          float spread = SOFT_SUN_SPREAD * max(softness, 0.05);\n\n          // Blocker search over the widest penumbra this receiver could have.\n          vec2 search = clamp(coord.z * SOFT_SUN_DEPTH * spread, SOFT_SUN_MIN, SOFT_SUN_MAX) * SOFT_SUN_UV;\n          float blockerDepth = 0.0;\n          float blockers = 0.0;\n          for (int i = 0; i < 16; i++) {\n            vec2 offset = (spin * SOFT_SUN_DISK[i]) * search;\n            float occluder = unpackRGBAToDepth(texture2D(shadowMap, coord.xy + offset));\n            if (occluder < coord.z + dot(slope, offset) - SOFT_SUN_EPSILON) {\n              blockerDepth += occluder;\n              blockers += 1.0;\n            }\n          }\n          if (blockers < 0.5) return 1.0;\n          if (blockers > 15.5) return 0.0;\n\n          float penumbra = clamp((coord.z - blockerDepth / blockers) * SOFT_SUN_DEPTH * spread, SOFT_SUN_MIN, SOFT_SUN_MAX);\n          vec2 filterRadius = penumbra * SOFT_SUN_UV;\n          float lit = 0.0;\n          for (int i = 0; i < 16; i++) {\n            vec2 offset = (spin * SOFT_SUN_DISK[i]) * filterRadius;\n            lit += step(coord.z + dot(slope, offset) - SOFT_SUN_EPSILON,\n              unpackRGBAToDepth(texture2D(shadowMap, coord.xy + offset)));\n          }\n          return lit * (1.0 / 16.0);\n        }\n      ");
            THREE.ShaderChunk.shadowmap_pars_fragment = chunk.replace("float getShadow(", "".concat(functions, "\n\tfloat getShadow(")).replace(pcf, "#if defined( SHADOWMAP_TYPE_PCF )\n			shadow = softSunShadow( shadowMap, shadowCoord.xyz, shadowRadius );");
            return true;
        }
        function createTramShadows(renderer2, train2, sun2) {
            var e_60, _d, e_61, _e, e_62, _f, e_63, _g;
            if (tramLocalLighting === localLighting)
                return null;
            train2.updateWorldMatrix(true, true);
            var localWorld = train2.matrixWorld.clone().invert();
            var casters = new THREE.Scene();
            var receivers = new Set();
            var originals = [];
            var depthMaterial = new THREE.MeshDepthMaterial({ side: THREE.DoubleSide, colorWrite: false });
            train2.traverse(function (object) {
                var e_64, _d;
                if (!object.isMesh)
                    return;
                try {
                    for (var _e = __values(Array.isArray(object.material) ? object.material : [object.material]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var finish = _f.value;
                        receivers.add(finish);
                    }
                }
                catch (e_64_1) { e_64 = { error: e_64_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_64) throw e_64.error; }
                }
                if (!object.castShadow)
                    return;
                var proxy = object.isInstancedMesh ? new THREE.InstancedMesh(object.geometry, depthMaterial, object.count) : new THREE.Mesh(object.geometry, depthMaterial);
                if (object.isInstancedMesh)
                    proxy.instanceMatrix = object.instanceMatrix;
                proxy.matrixAutoUpdate = false;
                proxy.matrix.multiplyMatrices(localWorld, object.matrixWorld);
                casters.add(proxy);
                originals.push(object);
            });
            if (!originals.length) {
                depthMaterial.dispose();
                return null;
            }
            var bounds = new THREE.Box3().setFromObject(casters);
            var center = bounds.getCenter(new THREE.Vector3());
            var worldSun = sun2.getWorldPosition(new THREE.Vector3()).sub(sun2.target.getWorldPosition(new THREE.Vector3())).normalize();
            var localSun = worldSun.clone().transformDirection(localWorld);
            var camera = new THREE.OrthographicCamera();
            camera.position.copy(center).addScaledVector(localSun, 22);
            camera.lookAt(center);
            camera.updateMatrixWorld(true);
            var projected = new THREE.Box3();
            var corner = new THREE.Vector3();
            try {
                for (var _h = __values([bounds.min.x, bounds.max.x]), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var x = _j.value;
                    try {
                        for (var _k = (e_61 = void 0, __values([bounds.min.y, bounds.max.y])), _l = _k.next(); !_l.done; _l = _k.next()) {
                            var y = _l.value;
                            try {
                                for (var _m = (e_62 = void 0, __values([bounds.min.z, bounds.max.z])), _o = _m.next(); !_o.done; _o = _m.next()) {
                                    var z = _o.value;
                                    projected.expandByPoint(corner.set(x, y, z).applyMatrix4(camera.matrixWorldInverse));
                                }
                            }
                            catch (e_62_1) { e_62 = { error: e_62_1 }; }
                            finally {
                                try {
                                    if (_o && !_o.done && (_f = _m.return)) _f.call(_m);
                                }
                                finally { if (e_62) throw e_62.error; }
                            }
                        }
                    }
                    catch (e_61_1) { e_61 = { error: e_61_1 }; }
                    finally {
                        try {
                            if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                        }
                        finally { if (e_61) throw e_61.error; }
                    }
                }
            }
            catch (e_60_1) { e_60 = { error: e_60_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                }
                finally { if (e_60) throw e_60.error; }
            }
            var extra = 0.28;
            Object.assign(camera, {
                left: projected.min.x - extra,
                right: projected.max.x + extra,
                bottom: projected.min.y - extra,
                top: projected.max.y + extra,
                near: Math.max(0.1, -projected.max.z - 0.5),
                far: -projected.min.z + (bounds.max.y + BASE_DEPTH + 1) / Math.max(localSun.y, 0.12)
            });
            camera.updateProjectionMatrix();
            var spanX = camera.right - camera.left, spanY = camera.top - camera.bottom;
            var size = Math.min(renderer2.capabilities.maxTextureSize, matchMedia("(pointer:coarse)").matches ? 960 : 1280);
            var pixelScale = size / Math.max(spanX, spanY);
            var width = Math.ceil(spanX * pixelScale), height = Math.ceil(spanY * pixelScale);
            var depth = new THREE.DepthTexture(width, height, THREE.UnsignedIntType);
            depth.name = "Tram-space sunlight depth";
            depth.minFilter = depth.magFilter = THREE.LinearFilter;
            depth.compareFunction = THREE.LessEqualCompare;
            var target = new THREE.WebGLRenderTarget(width, height, { depthTexture: depth });
            var localProjection = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(camera.projectionMatrix).multiply(camera.matrixWorldInverse);
            var uniforms = {
                tramDepth: { value: depth },
                tramShadowMatrix: { value: new THREE.Matrix4() },
                tramShadowScale: { value: new THREE.Vector2(1 / spanX, 1 / spanY) },
                tramShadowBias: { value: 7e-3 / (camera.far - camera.near) },
                tramShadowOpacity: { value: 0 },
                tramShadowSoftness: { value: 1 }
            };
            var edge = SITE_HALF_WIDTH + RAIL_APPROACH_LENGTH;
            var halfLength = (bounds.max.x - bounds.min.x) / 2;
            try {
                for (var originals_1 = __values(originals), originals_1_1 = originals_1.next(); !originals_1_1.done; originals_1_1 = originals_1.next()) {
                    var object = originals_1_1.value;
                    object.castShadow = false;
                }
            }
            catch (e_63_1) { e_63 = { error: e_63_1 }; }
            finally {
                try {
                    if (originals_1_1 && !originals_1_1.done && (_g = originals_1.return)) _g.call(originals_1);
                }
                finally { if (e_63) throw e_63.error; }
            }
            var dirty = true;
            return {
                receivers: receivers,
                uniforms: uniforms,
                update: function (rain) {
                    localWorld.copy(train2.matrixWorld).invert();
                    uniforms.tramShadowMatrix.value.multiplyMatrices(localProjection, localWorld);
                    var fade = THREE.MathUtils.smoothstep(Math.abs(train2.position.x), edge - halfLength, edge + halfLength);
                    uniforms.tramShadowOpacity.value = train2.visible ? 1 - fade : 0;
                    uniforms.tramShadowSoftness.value = THREE.MathUtils.lerp(1, 2.1, rain);
                    if (!dirty)
                        return;
                    var previous = renderer2.getRenderTarget();
                    var clipping = renderer2.clippingPlanes;
                    var shadows = renderer2.shadowMap.enabled, clear = renderer2.autoClear;
                    renderer2.clippingPlanes = [];
                    renderer2.shadowMap.enabled = false;
                    renderer2.autoClear = false;
                    try {
                        renderer2.setRenderTarget(target);
                        renderer2.clearDepth();
                        renderer2.render(casters, camera);
                        dirty = false;
                    }
                    finally {
                        renderer2.setRenderTarget(previous);
                        renderer2.autoClear = clear;
                        renderer2.clippingPlanes = clipping;
                        renderer2.shadowMap.enabled = shadows;
                    }
                },
                invalidate: function () {
                    dirty = true;
                },
                dispose: function () {
                    target.dispose();
                    depthMaterial.dispose();
                }
            };
        }
        var FULLSCREEN_VERTEX = "varying vec2 vUv;\n      void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}";
        function createScreenSpaceLighting(_d) {
            var e_65, _e;
            var camera = _d.camera, sun2 = _d.sun, occlusion = _d.occlusion, lamps2 = _d.lamps, bounds = _d.bounds;
            var lampCount = Math.min(lamps2.length, 12);
            var halfTarget = function () { return new THREE.WebGLRenderTarget(1, 1, {
                type: THREE.HalfFloatType,
                depthBuffer: false,
                generateMipmaps: false,
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter
            }); };
            var gathered = halfTarget();
            var blurred = halfTarget();
            var resolved = new THREE.WebGLRenderTarget(1, 1, {
                type: THREE.HalfFloatType,
                depthBuffer: false,
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            });
            var fullSize = new THREE.Vector2(1, 1);
            var halfSize = new THREE.Vector2(1, 1);
            var projection = new THREE.Matrix4();
            var projectionInverse = new THREE.Matrix4();
            var lampSpheres = [];
            var lampPowers = [];
            try {
                for (var _f = __values(lamps2.slice(0, lampCount)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var lamp = _g.value;
                    lampSpheres.push(new THREE.Vector4(lamp.position.x, lamp.position.y, lamp.position.z, lamp.range));
                    lampPowers.push(lamp.power);
                }
            }
            catch (e_65_1) { e_65 = { error: e_65_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_e = _f.return)) _e.call(_f);
                }
                finally { if (e_65) throw e_65.error; }
            }
            var gatherMaterial = new THREE.ShaderMaterial({
                defines: { LAMP_COUNT: lampCount, AO_SAMPLES: 16, SUN_STEPS: 24 },
                uniforms: {
                    tDepth: { value: null },
                    tShadow: { value: null },
                    shadowReady: { value: 0 },
                    shadowMatrix: { value: new THREE.Matrix4() },
                    fullSize: { value: fullSize },
                    cameraProjection: { value: projection },
                    cameraProjectionInverse: { value: projectionInverse },
                    cameraWorld: { value: camera.matrixWorld },
                    aoRadius: { value: 0.62 },
                    aoIntensity: { value: 1 },
                    sunAir: { value: 1 },
                    hazeFalloff: { value: 0.26 },
                    volumeMin: { value: bounds.min.clone() },
                    volumeMax: { value: bounds.max.clone() },
                    lampSpheres: { value: lampSpheres },
                    lampPowers: { value: lampPowers }
                },
                vertexShader: FULLSCREEN_VERTEX,
                fragmentShader: "\n          #include <packing>\n          uniform sampler2D tDepth;\n          uniform sampler2D tShadow;\n          uniform float shadowReady;\n          uniform mat4 shadowMatrix;\n          uniform vec2 fullSize;\n          uniform mat4 cameraProjection;\n          uniform mat4 cameraProjectionInverse;\n          uniform mat4 cameraWorld;\n          uniform float aoRadius;\n          uniform float aoIntensity;\n          uniform float sunAir;\n          uniform float hazeFalloff;\n          uniform vec3 volumeMin;\n          uniform vec3 volumeMax;\n          #if LAMP_COUNT > 0\n            uniform vec4 lampSpheres[LAMP_COUNT];\n            uniform float lampPowers[LAMP_COUNT];\n          #endif\n          varying vec2 vUv;\n\n          // Positions are rebuilt at exact depth-texel centres; half-resolution\n          // pixel centres fall between texels and would tilt flat walls.\n          vec2 snapToTexel(vec2 uv) {\n            return (floor(uv * fullSize) + 0.5) / fullSize;\n          }\n          vec3 viewAt(vec2 uv, float depth) {\n            vec4 p = cameraProjectionInverse * vec4(vec3(uv, depth) * 2.0 - 1.0, 1.0);\n            return p.xyz / p.w;\n          }\n          vec3 viewAt(vec2 uv) {\n            vec2 texelUv = snapToTexel(uv);\n            return viewAt(texelUv, texture2D(tDepth, texelUv).x);\n          }\n          float screenNoise(vec2 p) {\n            return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));\n          }\n\n          void main() {\n            vec2 uv = snapToTexel(vUv);\n            float depth = texture2D(tDepth, uv).x;\n            vec3 P = viewAt(uv, depth);\n            bool open = depth >= 0.999999;\n            float jitter = screenNoise(gl_FragCoord.xy);\n            float spin = 6.2831853 * screenNoise(gl_FragCoord.yx + vec2(37.0, 11.0));\n\n            // Ambient occlusion (scalable ambient obscurance over a spiral disc).\n            float occlusion = 1.0;\n            if (!open && aoIntensity > 0.0) {\n              vec2 texel = 1.0 / fullSize;\n              vec3 right = viewAt(uv + vec2(texel.x, 0.0));\n              vec3 left = viewAt(uv - vec2(texel.x, 0.0));\n              vec3 above = viewAt(uv + vec2(0.0, texel.y));\n              vec3 below = viewAt(uv - vec2(0.0, texel.y));\n              vec3 ddxP = abs(right.z - P.z) < abs(P.z - left.z) ? right - P : P - left;\n              vec3 ddyP = abs(above.z - P.z) < abs(P.z - below.z) ? above - P : P - below;\n              vec3 N = normalize(cross(ddxP, ddyP));\n              vec2 disc = vec2(cameraProjection[0][0], cameraProjection[1][1]) * 0.5 * aoRadius;\n              float radius2 = aoRadius * aoRadius;\n              float sum = 0.0;\n              for (int i = 0; i < AO_SAMPLES; i++) {\n                float along = (float(i) + jitter) / float(AO_SAMPLES);\n                float angle = spin + float(i) * 2.3999632;\n                vec3 v = viewAt(uv + vec2(cos(angle), sin(angle)) * along * disc) - P;\n                float vv = dot(v, v);\n                float falloff = max(radius2 - vv, 0.0) / radius2;\n                sum += falloff * falloff * max(dot(v, N) - 0.004, 0.0) / (vv + 0.004) * aoRadius;\n              }\n              occlusion = clamp(1.0 - aoIntensity * sum / float(AO_SAMPLES), 0.0, 1.0);\n            }\n\n            vec3 rayDir = normalize((cameraWorld * vec4(0.0, 0.0, -1.0, 0.0)).xyz);\n            vec3 rayOrigin = (cameraWorld * vec4(P.xy, 0.0, 1.0)).xyz;\n            float rayLength = -P.z;\n\n            // Sunlight scattered along the view ray inside the street volume.\n            float sunScatter = 0.0;\n            if (sunAir > 0.0 && shadowReady > 0.5) {\n              vec3 safeDir = mix(rayDir, vec3(1e-6), vec3(equal(rayDir, vec3(0.0))));\n              vec3 inverseDir = 1.0 / safeDir;\n              vec3 nearHit = (volumeMin - rayOrigin) * inverseDir;\n              vec3 farHit = (volumeMax - rayOrigin) * inverseDir;\n              vec3 entry = min(nearHit, farHit);\n              vec3 exit = max(nearHit, farHit);\n              float t0 = max(max(entry.x, entry.y), max(entry.z, 0.0));\n              float t1 = min(min(exit.x, exit.y), min(exit.z, rayLength));\n              if (t1 > t0) {\n                float stepLength = (t1 - t0) / float(SUN_STEPS);\n                float t = t0 + stepLength * jitter;\n                for (int i = 0; i < SUN_STEPS; i++) {\n                  vec3 q = rayOrigin + rayDir * t;\n                  vec4 s = shadowMatrix * vec4(q, 1.0);\n                  float lit = 1.0;\n                  if (s.x > 0.0 && s.x < 1.0 && s.y > 0.0 && s.y < 1.0 && s.z < 1.0) {\n                    lit = step(s.z - 0.0015, unpackRGBAToDepth(texture2D(tShadow, s.xy)));\n                  }\n                  // Thin the haze toward the open edges of the street volume.\n                  vec2 inside = min(q.xz - volumeMin.xz, volumeMax.xz - q.xz);\n                  float edge = smoothstep(0.0, 3.0, min(inside.x, inside.y));\n                  sunScatter += lit * edge * exp(-max(q.y, 0.0) * hazeFalloff);\n                  t += stepLength;\n                }\n                sunScatter *= stepLength;\n              }\n            }\n\n            // Lamp light scattered by the same air: the in-scatter integral of an\n            // inverse-square source along a straight ray has a closed form.\n            float lampScatter = 0.0;\n            #if LAMP_COUNT > 0\n              for (int i = 0; i < LAMP_COUNT; i++) {\n                vec3 toLamp = lampSpheres[i].xyz - rayOrigin;\n                float range = lampSpheres[i].w;\n                float closest = dot(toLamp, rayDir);\n                float h2 = max(dot(toLamp, toLamp) - closest * closest, 0.0036);\n                float chord = range * range - h2;\n                if (chord > 0.0) {\n                  chord = sqrt(chord);\n                  float a = max(closest - chord, 0.0);\n                  float b = min(closest + chord, rayLength);\n                  if (b > a) {\n                    float h = sqrt(h2);\n                    float window = 1.0 - h2 / (range * range);\n                    lampScatter += lampPowers[i] * window * window * (atan((b - closest) / h) - atan((a - closest) / h)) / h;\n                  }\n                }\n              }\n            #endif\n\n            gl_FragColor = vec4(occlusion, sunScatter, lampScatter, rayLength);\n          }",
                depthTest: false,
                depthWrite: false
            });
            var blurMaterial = new THREE.ShaderMaterial({
                uniforms: { tInput: { value: null }, step: { value: new THREE.Vector2() } },
                vertexShader: FULLSCREEN_VERTEX,
                fragmentShader: "\n          uniform sampler2D tInput;\n          uniform vec2 step;\n          varying vec2 vUv;\n          void main() {\n            vec4 center = texture2D(tInput, vUv);\n            float depth = center.a;\n            float forward = texture2D(tInput, vUv + step).a - depth;\n            float backward = depth - texture2D(tInput, vUv - step).a;\n            // Follow the local depth slope, so tilted ground blurs while edges hold.\n            float slope = abs(forward) < abs(backward) ? forward : backward;\n            float tolerance = 0.08 + depth * 0.006;\n            vec3 sum = center.rgb;\n            float total = 1.0;\n            for (int i = 1; i <= 5; i++) {\n              float offset = float(i);\n              float gaussian = exp(-offset * offset * 0.09);\n              vec4 a = texture2D(tInput, vUv + step * offset);\n              vec4 b = texture2D(tInput, vUv - step * offset);\n              float wa = gaussian * max(0.0, 1.0 - abs(a.a - depth - slope * offset) / tolerance);\n              float wb = gaussian * max(0.0, 1.0 - abs(b.a - depth + slope * offset) / tolerance);\n              sum += a.rgb * wa + b.rgb * wb;\n              total += wa + wb;\n            }\n            gl_FragColor = vec4(sum / total, depth);\n          }",
                depthTest: false,
                depthWrite: false
            });
            var resolveMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    tHalf: { value: null },
                    tDepth: { value: null },
                    halfSize: { value: halfSize },
                    cameraProjectionInverse: { value: projectionInverse }
                },
                vertexShader: FULLSCREEN_VERTEX,
                fragmentShader: "\n          uniform sampler2D tHalf;\n          uniform sampler2D tDepth;\n          uniform vec2 halfSize;\n          uniform mat4 cameraProjectionInverse;\n          varying vec2 vUv;\n          void main() {\n            float depth = texture2D(tDepth, vUv).x;\n            vec4 p = cameraProjectionInverse * vec4(vec3(vUv, depth) * 2.0 - 1.0, 1.0);\n            float viewDepth = -p.z / p.w;\n            vec2 position = vUv * halfSize - 0.5;\n            vec2 base = floor(position);\n            vec2 f = position - base;\n            float tolerance = 0.1 + viewDepth * 0.008;\n            vec4 result = vec4(0.0);\n            float total = 0.0;\n            for (int j = 0; j < 2; j++) {\n              for (int i = 0; i < 2; i++) {\n                vec2 cell = base + vec2(float(i), float(j));\n                vec4 s = texture2D(tHalf, (cell + 0.5) / halfSize);\n                float bilinear = (i == 0 ? 1.0 - f.x : f.x) * (j == 0 ? 1.0 - f.y : f.y);\n                float w = bilinear * exp(-abs(s.a - viewDepth) / tolerance) + 1e-4 * bilinear;\n                result += s * w;\n                total += w;\n              }\n            }\n            gl_FragColor = vec4(result.rgb / max(total, 1e-6), viewDepth);\n          }",
                depthTest: false,
                depthWrite: false
            });
            var quad = new FullScreenQuad(gatherMaterial);
            var sunDirection = new THREE.Vector3();
            var forward = new THREE.Vector3();
            var viewProjection = new THREE.Matrix4();
            var lastViewProjection = new THREE.Matrix4();
            var sameView = function (a, b) { return a.elements.every(function (value, index) { return Math.abs(value - b.elements[index]) < 1e-7; }); };
            var settings = { occlusion: 0.92, aoPower: 2.2, aoRadius: 0.7, sunAir: 62e-4, lampAir: 0.01, hazeFalloff: 0.3, phase: 0.58 };
            var ScreenLightingPass = (function (_super) {
                __extends(ScreenLightingPass, _super);
                function ScreenLightingPass() {
                    var _this = _super.call(this) || this;
                    _this.needsSwap = false;
                    _this.valid = false;
                    _this.dirty = true;
                    _this.film = null;
                    return _this;
                }
                ScreenLightingPass.prototype.invalidate = function () {
                    this.dirty = true;
                };
                ScreenLightingPass.prototype.setSize = function (width, height) {
                    fullSize.set(width, height);
                    halfSize.set(Math.max(1, Math.ceil(width / 2)), Math.max(1, Math.ceil(height / 2)));
                    gathered.setSize(halfSize.x, halfSize.y);
                    blurred.setSize(halfSize.x, halfSize.y);
                    resolved.setSize(width, height);
                    this.valid = false;
                    occlusion.screenOcclusionStrength.value = 0;
                };
                ScreenLightingPass.prototype.render = function (renderer2, writeBuffer, readBuffer) {
                    var depth = readBuffer.depthTexture;
                    if (!depth) {
                        this.valid = false;
                        occlusion.screenOcclusionStrength.value = 0;
                        if (this.film)
                            this.film.uniforms.airReady.value = 0;
                        return;
                    }
                    viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
                    if (this.valid && !this.dirty && sameView(viewProjection, lastViewProjection)) {
                        this.updateFilm();
                        return;
                    }
                    lastViewProjection.copy(viewProjection);
                    this.dirty = false;
                    var shadow = sun2.shadow.map;
                    var uniforms = gatherMaterial.uniforms;
                    uniforms.tDepth.value = depth;
                    resolveMaterial.uniforms.tDepth.value = depth;
                    uniforms.aoRadius.value = settings.aoRadius;
                    uniforms.tShadow.value = shadow ? shadow.texture : null;
                    uniforms.shadowReady.value = shadow ? 1 : 0;
                    uniforms.shadowMatrix.value.copy(sun2.shadow.matrix);
                    projection.copy(camera.projectionMatrix);
                    projectionInverse.copy(camera.projectionMatrixInverse);
                    uniforms.aoIntensity.value = settings.occlusion > 0 ? settings.aoPower : 0;
                    uniforms.sunAir.value = settings.sunAir > 1e-5 && sun2.intensity > 0.05 ? 1 : 0;
                    uniforms.hazeFalloff.value = settings.hazeFalloff;
                    quad.material = gatherMaterial;
                    renderer2.setRenderTarget(gathered);
                    quad.render(renderer2);
                    quad.material = blurMaterial;
                    blurMaterial.uniforms.tInput.value = gathered.texture;
                    blurMaterial.uniforms.step.value.set(1 / halfSize.x, 0);
                    renderer2.setRenderTarget(blurred);
                    quad.render(renderer2);
                    blurMaterial.uniforms.tInput.value = blurred.texture;
                    blurMaterial.uniforms.step.value.set(0, 1 / halfSize.y);
                    renderer2.setRenderTarget(gathered);
                    quad.render(renderer2);
                    quad.material = resolveMaterial;
                    resolveMaterial.uniforms.tHalf.value = gathered.texture;
                    renderer2.setRenderTarget(resolved);
                    quad.render(renderer2);
                    occlusion.screenOcclusionMap.value = resolved.texture;
                    occlusion.screenOcclusionViewProjection.value.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
                    occlusion.screenOcclusionStrength.value = settings.occlusion;
                    this.valid = true;
                    this.updateFilm();
                };
                ScreenLightingPass.prototype.updateFilm = function () {
                    if (this.film) {
                        var film = this.film.uniforms;
                        film.tAir.value = resolved.texture;
                        film.airReady.value = 1;
                        sunDirection.copy(sun2.position).sub(sun2.target.position).normalize();
                        camera.getWorldDirection(forward);
                        var g = settings.phase;
                        var cosine = sunDirection.dot(forward);
                        var phase = (1 - g * g) / (4 * Math.PI * Math.pow(1 + g * g - 2 * g * cosine, 1.5));
                        film.sunAirColor.value.copy(sun2.color).multiplyScalar(sun2.intensity * phase * settings.sunAir * 4 * Math.PI);
                        film.lampAirColor.value.copy(LAMP_AIR_TINT).multiplyScalar(settings.lampAir);
                    }
                };
                ScreenLightingPass.prototype.dispose = function () {
                    gathered.dispose();
                    blurred.dispose();
                    resolved.dispose();
                    gatherMaterial.dispose();
                    blurMaterial.dispose();
                    resolveMaterial.dispose();
                    quad.dispose();
                };
                return ScreenLightingPass;
            }(Pass));
            var pass = new ScreenLightingPass();
            return {
                pass: pass,
                settings: settings,
                get texture() {
                    return resolved.texture;
                },
                materials: { gather: gatherMaterial, blur: blurMaterial, resolve: resolveMaterial },
                attachFilm: function (film) {
                    pass.film = film;
                    film.uniforms.tAir.value = resolved.texture;
                }
            };
        }
        var LAMP_AIR_TINT = new THREE.Color("#ffbf86");
        function collectAirLamps(scene) {
            var lamps2 = [];
            scene.updateMatrixWorld(true);
            scene.traverse(function (light) {
                if (!light.isPointLight || !light.userData.airGlow)
                    return;
                lamps2.push({
                    position: light.getWorldPosition(new THREE.Vector3()),
                    range: light.distance,
                    power: light.intensity * light.userData.airGlow / (4 * Math.PI)
                });
            });
            return lamps2.sort(function (a, b) { return b.power - a.power; }).slice(0, 12);
        }
        function buildSurroundings(scene) {
            var e_66, _d, e_67, _e, e_68, _f, e_69, _g;
            var district = new THREE.Group();
            district.name = "Residential lanes in the evening mist";
            scene.add(district);
            var finish = new THREE.MeshBasicMaterial({ color: 16777215 });
            finish.userData.distantNeighborhood = true;
            var batches = {
                box: { geometry: new THREE.BoxGeometry(), instances: [] },
                stem: { geometry: new THREE.CylinderGeometry(0.76, 1, 1, 7), instances: [] },
                crown: { geometry: new THREE.IcosahedronGeometry(1, 1), instances: [] }
            };
            var stamp = new THREE.Object3D();
            var up = new THREE.Vector3(0, 1, 0);
            var roofPositions = [];
            var roofColors = [];
            var earth = -0.028;
            var concrete = 7832728;
            var windowFrame = 5728642;
            var darkGlass = 6913433;
            var warmGlass = 13608599;
            var warmCurtain = 11638943;
            var poleColor = 6647944;
            var wireColor = 6648717;
            function save(batch, color2) {
                stamp.updateMatrix();
                batch.instances.push({ matrix: stamp.matrix.clone(), color: color2 });
            }
            function box2(color2, _d, _e, angle) {
                var _f = __read(_d, 3), x = _f[0], y = _f[1], z = _f[2];
                var _g = __read(_e, 3), width = _g[0], height = _g[1], depth = _g[2];
                if (angle === void 0) { angle = 0; }
                stamp.position.set(x, y, z);
                stamp.scale.set(width, height, depth);
                stamp.rotation.set(0, angle, 0);
                save(batches.box, color2);
            }
            function stem(color2, start, end, radius) {
                var _d, _e;
                var base = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(start), false)))();
                var tip = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(end), false)))();
                var axis = tip.clone().sub(base);
                stamp.position.copy(base).lerp(tip, 0.5);
                stamp.scale.set(radius, axis.length(), radius);
                stamp.quaternion.setFromUnitVectors(up, axis.normalize());
                save(batches.stem, color2);
            }
            function crown(color2, x, y, z, width, height, depth, angle) {
                stamp.position.set(x, y, z);
                stamp.scale.set(width, height, depth);
                stamp.rotation.set(0.08, angle, -0.13);
                save(batches.crown, color2);
            }
            function house(_d) {
                var e_70, _e, e_71, _f, e_72, _g, e_73, _h;
                var x = _d.x, z = _d.z, w = _d.w, d = _d.d, eaves = _d.eaves, rise = _d.rise, roof = _d.roof, wall = _d.wall, tile = _d.tile, _j = _d.turn, turn2 = _j === void 0 ? 0 : _j, _k = _d.lit, lit = _k === void 0 ? -1 : _k;
                var cos = Math.cos(turn2);
                var sin = Math.sin(turn2);
                var point = function (u, v, t) { return [x + u * cos + t * sin, v, z + t * cos - u * sin]; };
                var piece = function (color2, u, v, t, width, height, depth) {
                    box2(color2, point(u, v, t), [width, height, depth], turn2);
                };
                function triangle(a, b, c, color2) {
                    roofPositions.push.apply(roofPositions, __spreadArray(__spreadArray(__spreadArray([], __read(a), false), __read(b), false), __read(c), false));
                    for (var i = 0; i < 3; i++)
                        roofColors.push(color2.r, color2.g, color2.b);
                }
                function quad(a, b, c, d2, color2) {
                    triangle(a, b, c, color2);
                    triangle(a, c, d2, color2);
                }
                function ring(width, depth, y) {
                    return [
                        point(-width / 2, y, depth / 2),
                        point(width / 2, y, depth / 2),
                        point(width / 2, y, -depth / 2),
                        point(-width / 2, y, -depth / 2)
                    ];
                }
                function slopes(base, top, colors) {
                    for (var i = 0; i < 4; i++) {
                        var next = (i + 1) % 4;
                        quad(base[i], base[next], top[next], top[i], colors[i]);
                    }
                }
                var wallTone = new THREE.Color(wall);
                var wallShade = wallTone.clone().multiplyScalar(0.83);
                var wallShades = [wallTone, wallShade, wallShade, wallTone];
                var roofTone = new THREE.Color(tile);
                var roofShades = [1.08, 0.87, 1, 0.95].map(function (factor) { return roofTone.clone().multiplyScalar(factor); });
                var trim = wallTone.clone().lerp(roofTone, 0.52);
                var ridgeY = eaves + rise;
                piece(concrete, 0, earth + 0.115, 0, w + 0.13, 0.23, d + 0.13);
                slopes(ring(w, d, 0.12), ring(w, d, eaves), wallShades);
                piece(trim, 0, eaves - 0.045, 0, w + 0.28, 0.12, d + 0.28);
                if (roof === "flat") {
                    piece(tile, 0, eaves + 0.05, 0, w + 0.28, 0.13, d + 0.28);
                    try {
                        for (var _l = __values([-1, 1]), _m = _l.next(); !_m.done; _m = _l.next()) {
                            var side = _m.value;
                            piece(trim, 0, eaves + 0.16, side * (d / 2 + 0.09), w + 0.28, 0.13, 0.1);
                            piece(trim, side * (w / 2 + 0.09), eaves + 0.16, 0, 0.1, 0.13, d + 0.09);
                        }
                    }
                    catch (e_70_1) { e_70 = { error: e_70_1 }; }
                    finally {
                        try {
                            if (_m && !_m.done && (_e = _l.return)) _e.call(_l);
                        }
                        finally { if (e_70) throw e_70.error; }
                    }
                    piece(wallShade, -w * 0.24, eaves + rise / 2, -d * 0.2, w * 0.24, rise, d * 0.26);
                    piece(roofTone, -w * 0.24, ridgeY, -d * 0.2, w * 0.27, 0.07, d * 0.29);
                }
                else {
                    var roofWidth = w + 0.5;
                    var roofDepth = d + 0.56;
                    var isGabled = roof === "gable";
                    var ridgeWidth = isGabled ? roofWidth : roofWidth * 0.57;
                    var outer = ring(roofWidth, roofDepth, eaves - 5e-3);
                    var bendDepth = roofDepth * 0.72;
                    var bendY = eaves + rise * 0.25;
                    var bend = ring(roofWidth * (isGabled ? 1 : 0.96), bendDepth, bendY);
                    var ridge = ring(ridgeWidth, 0.062, ridgeY);
                    if (isGabled) {
                        var edgeY = THREE.MathUtils.lerp(eaves - 5e-3, bendY, (roofDepth - d) / (roofDepth - bendDepth));
                        var profile = [
                            [d / 2, edgeY],
                            [bendDepth / 2, bendY],
                            [0.031, ridgeY],
                            [-0.031, ridgeY],
                            [-bendDepth / 2, bendY],
                            [-d / 2, edgeY]
                        ];
                        try {
                            for (var _o = __values([-1, 1]), _p = _o.next(); !_p.done; _p = _o.next()) {
                                var side = _p.value;
                                var u = side * w / 2;
                                for (var i = 1; i < profile.length; i++) {
                                    var _q = __read(profile[i - 1], 2), z0 = _q[0], y0 = _q[1];
                                    var _r = __read(profile[i], 2), z1 = _r[0], y1 = _r[1];
                                    var a = point(u, eaves, z0);
                                    var b = point(u, eaves, z1);
                                    var c = point(u, y1, z1);
                                    var previous = point(u, y0, z0);
                                    if (side > 0)
                                        quad(a, b, c, previous, wallShade);
                                    else
                                        quad(b, a, previous, c, wallTone);
                                }
                            }
                        }
                        catch (e_71_1) { e_71 = { error: e_71_1 }; }
                        finally {
                            try {
                                if (_p && !_p.done && (_f = _o.return)) _f.call(_o);
                            }
                            finally { if (e_71) throw e_71.error; }
                        }
                    }
                    var faces = isGabled ? [0, 2] : [0, 1, 2, 3];
                    var fascia = ring(roofWidth, roofDepth, eaves - 0.09);
                    var roofEdge = roofTone.clone().multiplyScalar(0.81);
                    try {
                        for (var faces_1 = __values(faces), faces_1_1 = faces_1.next(); !faces_1_1.done; faces_1_1 = faces_1.next()) {
                            var i = faces_1_1.value;
                            var next = (i + 1) % 4;
                            quad(outer[i], outer[next], bend[next], bend[i], roofShades[i]);
                            quad(bend[i], bend[next], ridge[next], ridge[i], roofShades[i]);
                            quad(fascia[i], fascia[next], outer[next], outer[i], roofEdge);
                        }
                    }
                    catch (e_72_1) { e_72 = { error: e_72_1 }; }
                    finally {
                        try {
                            if (faces_1_1 && !faces_1_1.done && (_g = faces_1.return)) _g.call(faces_1);
                        }
                        finally { if (e_72) throw e_72.error; }
                    }
                    if (isGabled) {
                        try {
                            for (var _s = __values([
                                [outer[1], bend[1], ridge[1], ridge[2], bend[2], outer[2]],
                                [outer[3], bend[3], ridge[3], ridge[0], bend[0], outer[0]]
                            ]), _t = _s.next(); !_t.done; _t = _s.next()) {
                                var edge = _t.value;
                                for (var i = 1; i < edge.length; i++) {
                                    var _u = __read([edge[i - 1], edge[i]], 2), a = _u[0], b = _u[1];
                                    quad([a[0], a[1] - 0.085, a[2]], [b[0], b[1] - 0.085, b[2]], b, a, roofEdge);
                                }
                            }
                        }
                        catch (e_73_1) { e_73 = { error: e_73_1 }; }
                        finally {
                            try {
                                if (_t && !_t.done && (_h = _s.return)) _h.call(_s);
                            }
                            finally { if (e_73) throw e_73.error; }
                        }
                    }
                    piece(trim, 0, ridgeY + 0.018, 0, ridgeWidth + 0.09, 0.078, 0.117);
                }
                function window(u, y, t, width, height, side, glow) {
                    var offset = 0.022;
                    var paneWidth = (width - 0.142) / 2;
                    var panel = function (color2, tangent, dy, normal, pw, ph) {
                        var cx = side ? u + normal * side : u + tangent;
                        var cz = side ? t + tangent : t + normal * Math.sign(t);
                        piece(color2, cx, y + dy, cz, side ? 0.017 : pw, ph, side ? pw : 0.017);
                    };
                    panel(windowFrame, 0, 0, offset, width, height);
                    panel(glow ? warmGlass : darkGlass, -0.25 * width + 0.01, 0, offset + 0.013, paneWidth, height - 0.105);
                    panel(glow ? warmCurtain : darkGlass, 0.25 * width - 0.01, 0, offset + 0.013, paneWidth, height - 0.105);
                    panel(trim, 0, -height / 2, offset + 0.023, width + 0.13, 0.071);
                }
                var entrance = w * 0.23;
                var doorHeight = Math.min(1.7, eaves * 0.7);
                piece(windowFrame, entrance, 0.16 + doorHeight / 2, d / 2 + 0.019, 0.68, doorHeight, 0.052);
                piece(darkGlass, entrance, 0.16 + doorHeight * 0.66, d / 2 + 0.05, 0.45, doorHeight * 0.54, 0.022);
                piece(roofTone, entrance, 0.22 + doorHeight, d / 2 + 0.21, 1.02, 0.073, 0.56);
                piece(concrete, entrance, earth + 0.0725, d / 2 + 0.29, 0.96, 0.145, 0.49);
                piece(concrete, entrance, earth + 0.04, d / 2 + 0.83, 0.84, 0.08, 0.81);
                window(-w * 0.19, 0.21 + doorHeight * 0.61, d / 2, w * 0.32, 0.65, 0, lit === 0);
                window(w / 2, eaves * 0.59, -d * 0.09, d * 0.29, 0.64, 1, lit === 1);
                window(-w / 2, eaves * 0.6, d * 0.12, d * 0.24, 0.59, -1, lit === 2);
                window(-w * 0.15, eaves * 0.61, -d / 2, w * 0.29, 0.59, 0, false);
                if (eaves > 2.72) {
                    window(w * 0.21, eaves * 0.82, d / 2, w * 0.24, 0.44, 0, lit === 3);
                }
            }
            var west = -SITE_HALF_WIDTH;
            var rear = SITE_BACK;
            var turn = Math.PI / 2;
            var houses = [
                { x: west - 5.3, z: 6.15, w: 3.55, d: 4.18, eaves: 2.34, rise: 0.92, roof: "gable", wall: 8226456, tile: 6583955, turn: turn, lit: 0 },
                { x: west - 6.3, z: -10.6, w: 4.6, d: 4.4, eaves: 2.78, rise: 1.03, roof: "hip", wall: 8487831, tile: 6648461, turn: turn },
                { x: west - 12.1, z: 1.1, w: 4.1, d: 3.86, eaves: 2.48, rise: 0.8, roof: "gable", wall: 8096158, tile: 6518419, lit: 1 },
                { x: west - 12.4, z: -13.85, w: 4.82, d: 4.28, eaves: 2.56, rise: 0.47, roof: "flat", wall: 8556709, tile: 6847895 },
                { x: -11.25, z: rear - 4.45, w: 4.24, d: 3.81, eaves: 2.65, rise: 0.91, roof: "hip", wall: 8620955, tile: 6517393, lit: 0 },
                { x: -6.15, z: rear - 6.62, w: 3.52, d: 3.7, eaves: 2.29, rise: 0.84, roof: "gable", wall: 8030366, tile: 6387347 },
                { x: 10.9, z: rear - 4.91, w: 4.06, d: 3.68, eaves: 2.73, rise: 1.08, roof: "gable", wall: 8095901, tile: 6255246, lit: 0 },
                { x: 16.95, z: rear - 7.19, w: 4.62, d: 4.42, eaves: 2.76, rise: 0.91, roof: "hip", wall: 8291480, tile: 6648716 },
                { x: -13.8, z: rear - 12.15, w: 4.89, d: 4.32, eaves: 2.87, rise: 0.77, roof: "gable", wall: 8622244, tile: 6978453 },
                { x: -6.15, z: rear - 14.32, w: 3.65, d: 3.7, eaves: 2.54, rise: 0.58, roof: "flat", wall: 8688037, tile: 7241881, lit: 3 },
                { x: 10.7, z: rear - 13.05, w: 4.15, d: 4.17, eaves: 2.38, rise: 0.95, roof: "hip", wall: 8884644, tile: 7110554 },
                { x: 16.38, z: rear - 16.73, w: 4.18, d: 3.87, eaves: 2.7, rise: 0.82, roof: "gable", wall: 8884901, tile: 7242139 },
                { x: -16.1, z: rear - 18.76, w: 4.46, d: 4.08, eaves: 2.59, rise: 0.85, roof: "hip", wall: 8884901, tile: 7373467 },
                { x: -7.75, z: rear - 20.28, w: 4, d: 3.73, eaves: 2.47, rise: 0.65, roof: "gable", wall: 8951209, tile: 7636382 }
            ];
            houses.forEach(house);
            var hedge = [6782340, 7636365, 7045258, 8096146];
            var foliage = [6980235, 7375250, 8229273, 7770266];
            var random = randomFrom(2177);
            function shrub(x, z, radius) {
                for (var i = 0; i < 4; i++) {
                    var angle = i * Math.PI / 2 + random() * 0.33;
                    var scale = radius * (0.74 + random() * 0.3);
                    crown(hedge[i], x + Math.cos(angle) * radius * 0.49, scale * 0.48, z + Math.sin(angle) * radius * 0.48, scale, scale * 0.66, scale * 0.83, angle);
                }
            }
            function tree(x, z, height, width) {
                var trunkTop = [x - 0.11, height * 0.76, z + 0.05];
                stem(7172481, [x, earth, z], trunkTop, height * 0.039);
                for (var i = 0; i < 5; i++) {
                    var angle = i * Math.PI * 2 / 5 + random() * 0.4;
                    var branch = [
                        x + Math.cos(angle) * width * 0.62,
                        height * (0.58 + random() * 0.13),
                        z + Math.sin(angle) * width * 0.64
                    ];
                    stem(7370888, [x, height * 0.3, z], branch, height * 0.017);
                    crown(foliage[i % foliage.length], branch[0], branch[1] + height * 0.08, branch[2], width * 0.7, height * (0.19 + random() * 0.08), width * 0.67, angle);
                }
                crown(foliage[2], x - 0.09, height * 0.78, z + 0.04, width * 0.75, height * 0.25, width * 0.71, 0.8);
            }
            try {
                for (var _h = __values([
                    [west - 2.65, 1.2, 3.65, 1.12],
                    [west - 6.05, 11.35, 3.05, 0.96],
                    [west - 3.3, -14.96, 3.67, 1.31],
                    [west - 10.4, -7.08, 3.38, 1.2],
                    [-15.3, rear - 3.15, 3.62, 1.18],
                    [-8.7, rear - 10.75, 3.18, 1.04],
                    [14.1, rear - 2.2, 3.02, 0.87],
                    [19.25, rear - 12.9, 3.61, 1.09],
                    [-10.14, rear - 16.76, 3.96, 1.34],
                    [15.55, rear - 22.82, 3.45, 1.24]
                ]), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var _k = __read(_j.value, 4), x = _k[0], z = _k[1], height = _k[2], width = _k[3];
                    tree(x, z, height, width);
                }
            }
            catch (e_66_1) { e_66 = { error: e_66_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                }
                finally { if (e_66) throw e_66.error; }
            }
            try {
                for (var _l = __values([
                    [west - 1.8, 2.78, 0.54],
                    [west - 2.25, 9.88, 0.63],
                    [west - 2.98, -8.78, 0.48],
                    [west - 4.4, -16.1, 0.63],
                    [west - 7.8, 13.36, 0.73],
                    [-12.76, rear - 1.45, 0.57],
                    [-9.09, rear - 1.54, 0.61],
                    [-7.18, rear - 4.01, 0.47],
                    [8.86, rear - 1.63, 0.51],
                    [13, rear - 1.6, 0.52],
                    [16.6, rear - 4.12, 0.58],
                    [13.86, rear - 11.64, 0.68]
                ]), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var _o = __read(_m.value, 3), x = _o[0], z = _o[1], radius = _o[2];
                    shrub(x, z, radius);
                }
            }
            catch (e_67_1) { e_67 = { error: e_67_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_e = _l.return)) _e.call(_l);
                }
                finally { if (e_67) throw e_67.error; }
            }
            var gardenWall = 7898776;
            var cap = 8622240;
            function boundary(x, z, length, angle) {
                var e_74, _d;
                if (angle === void 0) { angle = 0; }
                box2(gardenWall, [x, 0.138, z], [length, 0.3, 0.18], angle);
                box2(cap, [x, 0.307, z], [length + 0.05, 0.05, 0.23], angle);
                try {
                    for (var _e = __values([-1, 1]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var side = _f.value;
                        var distance = side * (length / 2 - 0.07);
                        box2(cap, [x + Math.cos(angle) * distance, 0.234, z - Math.sin(angle) * distance], [0.21, 0.47, 0.24], angle);
                    }
                }
                catch (e_74_1) { e_74 = { error: e_74_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_74) throw e_74.error; }
                }
            }
            boundary(west - 1.75, 3.78, 1.78, turn);
            boundary(west - 1.75, 6.75, 1.78, turn);
            boundary(west - 2.9, -9.85, 1.7, turn);
            boundary(-12.29, rear - 2.08, 1.54);
            boundary(-9.12, rear - 2.08, 0.85);
            boundary(9.6, rear - 2.52, 1.77);
            boundary(12.72, rear - 2.52, 0.72);
            var verge = ROAD_LEFT - 3.53;
            var lamp = 14203298;
            var posts = [
                [verge, rear - 1.74, 3.94],
                [verge - 0.07, rear - 10.18, 4.04],
                [verge - 0.07, rear - 18.81, 4.16]
            ];
            posts.forEach(function (_d, index) {
                var e_75, _e;
                var _f = __read(_d, 3), x = _f[0], z = _f[1], y = _f[2];
                stem(poleColor, [x, earth, z], [x, y, z], 0.093);
                box2(poleColor, [x - 0.12, y - 0.14, z], [0.81, 0.08, 0.09]);
                try {
                    for (var _g = __values([-0.37, 0.14]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var offset = _h.value;
                        box2(concrete, [x + offset, y - 0.081, z], [0.09, 0.1, 0.1]);
                    }
                }
                catch (e_75_1) { e_75 = { error: e_75_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_e = _g.return)) _e.call(_g);
                    }
                    finally { if (e_75) throw e_75.error; }
                }
                if (index < 2) {
                    stem(poleColor, [x, y - 0.68, z], [x + 0.63, y - 0.46, z], 0.031);
                    box2(poleColor, [x + 0.68, y - 0.46, z], [0.28, 0.1, 0.18]);
                    box2(lamp, [x + 0.68, y - 0.519, z], [0.215, 0.024, 0.126]);
                }
            });
            try {
                for (var _p = __values([-0.37, 0.14]), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var offset = _q.value;
                    for (var i = 1; i < posts.length; i++) {
                        var _r = __read(posts[i - 1], 3), x0 = _r[0], z0 = _r[1], y0 = _r[2];
                        var _s = __read(posts[i], 3), x1 = _s[0], z1 = _s[1], y1 = _s[2];
                        var start = [x0 + offset, y0 - 0.021, z0];
                        for (var j = 1; j <= 12; j++) {
                            var t = j / 12;
                            var end = [
                                THREE.MathUtils.lerp(x0, x1, t) + offset,
                                THREE.MathUtils.lerp(y0, y1, t) - 0.021 - 0.36 * 4 * t * (1 - t),
                                THREE.MathUtils.lerp(z0, z1, t)
                            ];
                            stem(wireColor, start, end, 0.012);
                            start = end;
                        }
                    }
                }
            }
            catch (e_68_1) { e_68 = { error: e_68_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_f = _p.return)) _f.call(_p);
                }
                finally { if (e_68) throw e_68.error; }
            }
            var color = new THREE.Color();
            var _loop_9 = function (name, geometry, instances) {
                var mesh = new THREE.InstancedMesh(geometry, finish, instances.length);
                mesh.name = "Neighborhood " + name + " details";
                instances.forEach(function (_d, index) {
                    var matrix2 = _d.matrix, tint = _d.color;
                    mesh.setMatrixAt(index, matrix2);
                    mesh.setColorAt(index, color.set(tint));
                });
                district.add(mesh);
            };
            try {
                for (var _t = __values(Object.entries(batches)), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var _v = __read(_u.value, 2), name = _v[0], _w = _v[1], geometry = _w.geometry, instances = _w.instances;
                    _loop_9(name, geometry, instances);
                }
            }
            catch (e_69_1) { e_69 = { error: e_69_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_g = _t.return)) _g.call(_t);
                }
                finally { if (e_69) throw e_69.error; }
            }
            var roofs = new THREE.BufferGeometry();
            roofs.setAttribute("position", new THREE.Float32BufferAttribute(roofPositions, 3));
            roofs.setAttribute("color", new THREE.Float32BufferAttribute(roofColors, 3));
            var roofFinish = new THREE.MeshBasicMaterial({ vertexColors: true });
            roofFinish.userData.distantNeighborhood = true;
            var roofsMesh = new THREE.Mesh(roofs, roofFinish);
            roofsMesh.name = "Neighborhood rooflines and shaded fa\xE7ades";
            district.add(roofsMesh);
            return district;
        }
        function buildPocketGarden(parent) {
            var e_76, _d, e_77, _e, e_78, _f, e_79, _g, e_80, _h, e_81, _j, e_82, _k;
            var garden = new THREE.Group();
            garden.name = "Street-end garden and florist lane";
            parent.add(garden);
            var stone = material("#999e9b", { roughness: 0.97 });
            var timber = material("#8e6f59", { roughness: 0.89 });
            var iron = material("#394d54", { metalness: 0.15, roughness: 0.7 });
            var earth = material("#484e43");
            var leaf = material("#667e62", { roughness: 1 });
            var lightLeaf = material("#8a9c72", { roughness: 1 });
            var mossMap = paintedTexture(256, 128, function (ctx, w, h) {
                var e_83, _d;
                var rng = randomFrom(1394);
                ctx.fillStyle = "#75846a";
                ctx.fillRect(0, 0, w, h);
                for (var n = 0; n < 2400; n++) {
                    ctx.fillStyle = ["#4e655573", "#b1af7b5d", "#324c4548"][n % 3];
                    ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 3, 1 + rng() * 3);
                }
                try {
                    for (var _e = __values([[163, 30, 35, 30], [172, 72, 38, 27], [104, 78, 31, 25]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 4), x = _g[0], y = _g[1], width = _g[2], height = _g[3];
                        ctx.fillStyle = "#a5aa9a";
                        ctx.fillRect(x, y, width, height);
                        ctx.strokeStyle = "#5d695b";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x, y, width, height);
                    }
                }
                catch (e_83_1) { e_83 = { error: e_83_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_83) throw e_83.error; }
                }
            });
            block(garden, stone, -5.66, 0.23, 14.46, 2.35, 0.1, 1.86, false);
            var moss = place(garden, new THREE.PlaneGeometry(2.18, 1.69), material("#ffffff", { map: mossMap }), -5.66, 0.285, 14.46, false);
            moss.rotation.x = -Math.PI / 2;
            try {
                for (var _l = __values([-4, -2.84]), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var x = _m.value;
                    try {
                        for (var _o = (e_77 = void 0, __values([14.23, 14.6])), _p = _o.next(); !_p.done; _p = _o.next()) {
                            var z = _p.value;
                            rod(garden, iron, [x, 0.18, z], [x, 0.59, z], 0.032);
                        }
                    }
                    catch (e_77_1) { e_77 = { error: e_77_1 }; }
                    finally {
                        try {
                            if (_p && !_p.done && (_e = _o.return)) _e.call(_o);
                        }
                        finally { if (e_77) throw e_77.error; }
                    }
                    rod(garden, iron, [x, 0.54, 14.2], [x, 0.54, 14.64], 0.028);
                    rod(garden, iron, [x, 0.52, 14.2], [x, 0.99, 14.17], 0.028);
                }
            }
            catch (e_76_1) { e_76 = { error: e_76_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_76) throw e_76.error; }
            }
            try {
                for (var _q = __values([14.25, 14.4, 14.55]), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var z = _r.value;
                    block(garden, timber, -3.42, 0.62, z, 1.72, 0.055, 0.13);
                }
            }
            catch (e_78_1) { e_78 = { error: e_78_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_f = _q.return)) _f.call(_q);
                }
                finally { if (e_78) throw e_78.error; }
            }
            try {
                for (var _s = __values([0.82, 0.97]), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var y = _t.value;
                    block(garden, timber, -3.42, y, 14.18, 1.72, 0.11, 0.055);
                }
            }
            catch (e_79_1) { e_79 = { error: e_79_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_g = _s.return)) _g.call(_s);
                }
                finally { if (e_79) throw e_79.error; }
            }
            var leafGeo = new THREE.IcosahedronGeometry(1, 1);
            var clusters = [];
            var random = randomFrom(3001);
            try {
                for (var _u = __values([[-12.98, 6.78, 0.64, 2.1], [-12.9, -10.52, 0.56, 1.72], [-5.55, 15.26, 2.21, 0.31]]), _v = _u.next(); !_v.done; _v = _u.next()) {
                    var _w = __read(_v.value, 4), x = _w[0], z = _w[1], width = _w[2], depth = _w[3];
                    block(garden, stone, x, 0.33, z, width, 0.3, depth);
                    block(garden, earth, x, 0.489, z, width - 0.1, 0.017, depth - 0.1, false);
                    for (var i = 0; i < 19; i++) {
                        clusters.push({ x: x + (random() - 0.5) * (width - 0.06), z: z + (random() - 0.5) * (depth - 0.07), y: 0.55 + random() * 0.15, size: 0.11 + random() * 0.13 });
                    }
                }
            }
            catch (e_80_1) { e_80 = { error: e_80_1 }; }
            finally {
                try {
                    if (_v && !_v.done && (_h = _u.return)) _h.call(_u);
                }
                finally { if (e_80) throw e_80.error; }
            }
            var dummy = new THREE.Object3D();
            var _loop_10 = function (index, finish) {
                var selected = clusters.filter(function (_, i) { return i % 2 === index; });
                var batch = new THREE.InstancedMesh(leafGeo, finish, selected.length);
                selected.forEach(function (item, i) {
                    dummy.position.set(item.x, item.y, item.z);
                    dummy.rotation.set(i * 0.27, i * 0.91, 0);
                    dummy.scale.set(item.size * 1.19, item.size * 0.76, item.size);
                    dummy.updateMatrix();
                    batch.setMatrixAt(i, dummy.matrix);
                });
                batch.castShadow = batch.receiveShadow = true;
                garden.add(batch);
            };
            try {
                for (var _x = __values([leaf, lightLeaf].entries()), _y = _x.next(); !_y.done; _y = _x.next()) {
                    var _z = __read(_y.value, 2), index = _z[0], finish = _z[1];
                    _loop_10(index, finish);
                }
            }
            catch (e_81_1) { e_81 = { error: e_81_1 }; }
            finally {
                try {
                    if (_y && !_y.done && (_j = _x.return)) _j.call(_x);
                }
                finally { if (e_81) throw e_81.error; }
            }
            var path = new THREE.InstancedMesh(blockGeometry, stone, 20);
            for (var i = 0; i < 20; i++) {
                dummy.position.set(-12.93, 0.188, -0.2 + i * 0.68);
                dummy.rotation.set(0, (i % 3 - 1) * 0.024, 0);
                dummy.scale.set(0.62, 0.025, 0.52);
                dummy.updateMatrix();
                path.setMatrixAt(i, dummy.matrix);
            }
            path.receiveShadow = true;
            garden.add(path);
            var glass = material("#ffe0b6", { emissive: "#ffca85", emissiveIntensity: 1.42, roughness: 0.65 });
            try {
                for (var _0 = __values([[-12.72, 5.62], [-5.01, 15.02]]), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                    var _2 = __read(_1.value, 2), x = _2[0], z = _2[1];
                    block(garden, iron, x, 0.42, z, 0.1, 0.48, 0.1);
                    block(garden, iron, x, 0.75, z, 0.24, 0.11, 0.24);
                    block(garden, glass, x, 0.64, z, 0.17, 0.17, 0.17, false);
                    block(garden, iron, x, 0.544, z, 0.24, 0.038, 0.24);
                }
            }
            catch (e_82_1) { e_82 = { error: e_82_1 }; }
            finally {
                try {
                    if (_1 && !_1.done && (_k = _0.return)) _k.call(_0);
                }
                finally { if (e_82) throw e_82.error; }
            }
            var lantern = new THREE.PointLight("#ffd3a0", 1.2, 2.2, 2);
            lantern.position.set(-5.01, 0.72, 15.02);
            lantern.userData.airGlow = 1;
            garden.add(lantern);
        }
        function buildStreetLife(parent) {
            var e_84, _d, e_85, _e, e_86, _f, e_87, _g, e_88, _h, e_89, _j, e_90, _k, e_91, _l;
            var streetLife = new THREE.Group();
            streetLife.name = "Caf\xE9 terrace, bus stop and evening pedestrians";
            parent.add(streetLife);
            var pavement = 0.18;
            var rng = randomFrom(7729);
            var up = new THREE.Vector3(0, 1, 0);
            var unrotated = new THREE.Quaternion();
            var stamp = new THREE.Matrix4();
            var boxShape = new THREE.BoxGeometry(1, 1, 1);
            var tubeShape = new THREE.CylinderGeometry(1, 1, 1, 9);
            var taperedTube = new THREE.CylinderGeometry(0.76, 1, 1, 10);
            var ovalShape = new THREE.SphereGeometry(1, 10, 8);
            var detailBatches = new Map();
            var graphite = material("#37434a", { roughness: 0.62, metalness: 0.17 });
            var agedMetal = material("#797e78", { roughness: 0.54, metalness: 0.25 });
            var cream = material("#c8ba9e");
            var tan = material("#b17b56");
            var peat = material("#4c3932");
            var terracotta = material("#b06e56");
            var ceramicGreen = material("#799087", { roughness: 0.42 });
            var cedar = material("#86614c");
            var cedarEdge = material("#a98569");
            var stem = material("#526b4c");
            var leafFinish = material("#ffffff", { side: THREE.DoubleSide });
            var petalFinish = material("#ffffff");
            var leaves = ["#4c7351", "#608a52", "#78965c", "#9aab69", "#42695e"].map(function (color) { return new THREE.Color(color); });
            var petals2 = ["#e6a1ac", "#f7bdb7", "#d788a2", "#e8b680", "#e6dec2"].map(function (color) { return new THREE.Color(color); });
            function frame(x, z, yaw2, y) {
                if (yaw2 === void 0) { yaw2 = 0; }
                if (y === void 0) { y = pavement; }
                var host = new THREE.Group();
                host.position.set(x, y, z);
                host.rotation.y = yaw2;
                host.updateMatrix();
                streetLife.add(host);
                return host;
            }
            function detail(host, geometry, finish, point, size, rotation, cast, color) {
                var _d, _e;
                if (rotation === void 0) { rotation = unrotated; }
                if (cast === void 0) { cast = true; }
                var key = "".concat(geometry.id, "/").concat(finish.id, "/").concat(cast);
                if (!detailBatches.has(key))
                    detailBatches.set(key, { geometry: geometry, finish: finish, cast: cast, matrices: [], colors: [] });
                stamp.compose(new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(point), false)))(), rotation, new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(size), false)))());
                var batch = detailBatches.get(key);
                batch.matrices.push(stamp.clone().premultiply(host.matrix));
                batch.colors.push(color);
            }
            function box2(host, finish, point, width, height, depth, rotation, cast) {
                if (rotation === void 0) { rotation = unrotated; }
                if (cast === void 0) { cast = true; }
                detail(host, boxShape, finish, point, [width, height, depth], rotation, cast);
            }
            function oval(host, finish, point, width, height, depth, rotation, color) {
                if (rotation === void 0) { rotation = unrotated; }
                detail(host, ovalShape, finish, point, [width, height, depth], rotation, !color, color);
            }
            function segment(host, finish, start, end, radius, taper, cast) {
                var _d, _e;
                if (taper === void 0) { taper = false; }
                if (cast === void 0) { cast = true; }
                var point = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(start), false)))();
                var target = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(end), false)))();
                var axis = target.clone().sub(point);
                var length = axis.length();
                var rotation = new THREE.Quaternion().setFromUnitVectors(up, axis.normalize());
                detail(host, taper ? taperedTube : tubeShape, finish, point.lerp(target, 0.5).toArray(), [radius, length, radius], rotation, cast);
            }
            function yaw(angle) {
                return new THREE.Quaternion().setFromAxisAngle(up, angle);
            }
            var contact = new THREE.MeshBasicMaterial({
                transparent: true,
                depthWrite: false,
                color: "#746478",
                opacity: 0.66,
                map: paintedTexture(64, 64, function (ctx, w, h) {
                    var falloff = ctx.createRadialGradient(w / 2, h / 2, 3, w / 2, h / 2, w / 2);
                    falloff.addColorStop(0, "#281e2ea3");
                    falloff.addColorStop(0.42, "#2e243965");
                    falloff.addColorStop(1, "#3b304600");
                    ctx.fillStyle = falloff;
                    ctx.fillRect(0, 0, w, h);
                })
            });
            var contactShape = new THREE.PlaneGeometry(1, 1);
            var flat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
            function groundShadow(host, width, depth, x, z) {
                if (x === void 0) { x = 0; }
                if (z === void 0) { z = 0; }
                var patch = place(host, contactShape, contact, x, 6e-3, z, false);
                patch.scale.set(width, depth, 1);
                patch.quaternion.copy(flat);
                patch.renderOrder = -1;
            }
            var leafShape = new THREE.BufferGeometry();
            leafShape.setAttribute("position", new THREE.Float32BufferAttribute([
                0,
                0,
                0,
                -0.35,
                0.28,
                0,
                -0.5,
                0.54,
                0.026,
                -0.28,
                0.79,
                0,
                0,
                1,
                -0.13,
                0.28,
                0.79,
                0,
                0.5,
                0.54,
                0.026,
                0.35,
                0.28,
                0,
                0,
                0.48,
                0.15
            ], 3));
            leafShape.setIndex([0, 8, 1, 1, 8, 2, 2, 8, 3, 3, 8, 4, 4, 8, 5, 5, 8, 6, 6, 8, 7, 7, 8, 0]);
            leafShape.computeVertexNormals();
            function leaf(host, point, direction, width, length, tone) {
                var _d;
                var rotation = new THREE.Quaternion().setFromUnitVectors(up, new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(direction), false)))().normalize());
                detail(host, leafShape, leafFinish, point, [width, length, length], rotation, false, tone);
            }
            function blossoms(host, x, y, z, radius, tone) {
                for (var i = 0; i < 5; i++) {
                    var angle = i * Math.PI * 0.4;
                    oval(host, petalFinish, [x + Math.cos(angle) * radius * 0.64, y, z + Math.sin(angle) * radius * 0.64], radius * 0.56, radius * 0.31, radius * 0.38, yaw(-angle), tone);
                }
                oval(host, petalFinish, [x, y + radius * 0.17, z], radius * 0.31, radius * 0.26, radius * 0.31, unrotated, petals2[3]);
            }
            function sprig(host, x, y, z, height, bend, blooming) {
                var angle = rng() * Math.PI * 2;
                var dx = Math.cos(angle) * bend;
                var dz = Math.sin(angle) * bend;
                var middle = [x + dx * 0.37, y + height * 0.54, z + dz * 0.37];
                var tip = [x + dx, y + height, z + dz];
                segment(host, stem, [x, y, z], middle, 9e-3, false, false);
                segment(host, stem, middle, tip, 7e-3, true, false);
                for (var i = 0; i < 5; i++) {
                    var f = 0.22 + i * 0.17;
                    var a = angle + i * 2.4;
                    leaf(host, [x + dx * f, y + height * f, z + dz * f], [Math.cos(a), 0.22 + rng() * 0.92, Math.sin(a)], 0.041 + rng() * 0.035, 0.1 + rng() * 0.09, leaves[(i + Math.floor(rng() * 4)) % leaves.length]);
                }
                if (blooming)
                    blossoms.apply(void 0, __spreadArray(__spreadArray([host], __read(tip), false), [0.035 + rng() * 0.015, petals2[Math.floor(rng() * petals2.length)]], false));
            }
            function pot(host, x, z, radius, height, clay) {
                detail(host, taperedTube, clay, [x, height * 0.46, z], [radius, height * 0.9, radius], new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI));
                detail(host, tubeShape, clay, [x, height * 0.87, z], [radius * 1.065, height * 0.24, radius * 1.065]);
                detail(host, tubeShape, peat, [x, height * 0.995, z], [radius * 0.92, 0.014, radius * 0.92], unrotated, false);
            }
            function trough(host, width, depth, height, clay) {
                var e_92, _d;
                groundShadow(host, width + 0.48, depth + 0.43);
                box2(host, graphite, [0, 0.037, 0], width * 0.88, 0.074, depth * 0.8);
                box2(host, clay, [0, height * 0.52, 0], width, height * 0.88, depth);
                box2(host, peat, [0, height - 0.015, 0], width - 0.057, 0.022, depth - 0.052, unrotated, false);
                try {
                    for (var _e = __values([-1, 1]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var sign = _f.value;
                        box2(host, cedarEdge, [0, height - 2e-3, sign * (depth / 2 - 0.019)], width + 0.028, 0.045, 0.045);
                        box2(host, cedarEdge, [sign * (width / 2 - 0.018), height - 2e-3, 0], 0.042, 0.045, depth - 0.031);
                    }
                }
                catch (e_92_1) { e_92 = { error: e_92_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_92) throw e_92.error; }
                }
                for (var i = 0; i < 12; i++) {
                    var x = (i % 6 - 2.5) * (width - 0.098) / 6;
                    var z = (i < 6 ? -0.22 : 0.22) * depth;
                    sprig(host, x, height, z, 0.19 + rng() * 0.3, 0.04 + rng() * 0.14, i % 4 !== 2);
                }
            }
            trough(frame(-2.83, 3.06, Math.PI / 2 + 0.03), 0.8, 0.36, 0.26, cedar);
            trough(frame(-3.69, 10.1, Math.PI / 2 + 0.15), 0.91, 0.4, 0.31, cedar);
            var vendingPots = frame(8.57, 0.52, -0.14);
            groundShadow(vendingPots, 1.03, 0.61);
            try {
                for (var _m = __values([[-0.23, 0.025, 0.192, 0.28, ceramicGreen], [0.24, -0.07, 0.158, 0.23, terracotta]]), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var _p = __read(_o.value, 5), x = _p[0], z = _p[1], r = _p[2], h = _p[3], clay = _p[4];
                    pot(vendingPots, x, z, r, h, clay);
                    for (var i = 0; i < 6; i++)
                        sprig(vendingPots, x + (rng() - 0.5) * r, h, z + (rng() - 0.5) * r, 0.15 + rng() * 0.3, 0.04 + rng() * 0.12, i % 3 === 1);
                }
            }
            catch (e_84_1) { e_84 = { error: e_84_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                }
                finally { if (e_84) throw e_84.error; }
            }
            var trellis = frame(-3.24, 6.25, Math.PI / 2);
            groundShadow(trellis, 0.61, 0.67);
            pot(trellis, 0, 0, 0.192, 0.31, terracotta);
            try {
                for (var _q = __values([-0.12, 0.12]), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var x = _r.value;
                    segment(trellis, cedarEdge, [x, 0.29, -0.085], [x, 1.48, -0.085], 0.018);
                }
            }
            catch (e_85_1) { e_85 = { error: e_85_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_e = _q.return)) _e.call(_q);
                }
                finally { if (e_85) throw e_85.error; }
            }
            for (var i = 0; i < 5; i++) {
                var y = 0.47 + i * 0.215;
                segment(trellis, cedarEdge, [-0.137, y, -0.085], [0.137, y, -0.085], 0.013);
            }
            for (var strand = 0; strand < 3; strand++) {
                var base = [(strand - 1) * 0.05, 0.29, 0.012];
                for (var i = 1; i <= 9; i++) {
                    var end = [
                        Math.sin(i * 0.72 + strand * 2.09) * (0.1 + strand * 0.017),
                        0.29 + i * (0.093 + strand * 0.01),
                        -0.05 + Math.sin(i * 0.79 + strand) * 0.041
                    ];
                    segment(trellis, stem, base, end, 9e-3, true, false);
                    try {
                        for (var _s = (e_86 = void 0, __values([-1, 1])), _t = _s.next(); !_t.done; _t = _s.next()) {
                            var sign = _t.value;
                            leaf(trellis, end, [sign * (0.63 + rng()), 0.27 + rng() * 0.73, 0.42], 0.05 + rng() * 0.037, 0.11 + rng() * 0.06, leaves[(i + strand + 2) % leaves.length]);
                        }
                    }
                    catch (e_86_1) { e_86 = { error: e_86_1 }; }
                    finally {
                        try {
                            if (_t && !_t.done && (_f = _s.return)) _f.call(_s);
                        }
                        finally { if (e_86) throw e_86.error; }
                    }
                    base = end;
                }
            }
            var utility = frame(8.72, -0.4, -0.12);
            groundShadow(utility, 0.84, 0.57);
            box2(utility, graphite, [0, 0.061, 0], 0.51, 0.12, 0.36);
            box2(utility, agedMetal, [0, 0.43, 0], 0.45, 0.67, 0.3);
            box2(utility, ceramicGreen, [0, 0.43, 0.16], 0.407, 0.6, 0.027);
            box2(utility, agedMetal, [0, 0.767, 0], 0.48, 0.049, 0.33);
            for (var i = 0; i < 5; i++)
                box2(utility, graphite, [-0.067, 0.548 + i * 0.027, 0.178], 0.183, 0.011, 0.012, unrotated, false);
            box2(utility, cream, [0.092, 0.403, 0.18], 0.09, 0.12, 0.011, unrotated, false);
            box2(utility, tan, [0.092, 0.433, 0.187], 0.047, 0.015, 9e-3, unrotated, false);
            box2(utility, graphite, [0.15, 0.318, 0.181], 0.025, 0.071, 0.018, unrotated, false);
            try {
                for (var _u = __values([-0.178, 0.178]), _v = _u.next(); !_v.done; _v = _u.next()) {
                    var x = _v.value;
                    segment(utility, agedMetal, [x, 0.18, -0.13], [x, 0.082, -0.24], 0.027);
                    segment(utility, graphite, [x, 0.082, -0.24], [x, 0.03, -0.24], 0.03);
                }
            }
            catch (e_87_1) { e_87 = { error: e_87_1 }; }
            finally {
                try {
                    if (_v && !_v.done && (_g = _u.return)) _g.call(_u);
                }
                finally { if (e_87) throw e_87.error; }
            }
            var lanternGlass = material("#ffe4aa", { emissive: "#ff9c53", emissiveIntensity: 1.72, roughness: 0.45 });
            var lantern = frame(-3.08, 5.83, 0.13);
            groundShadow(lantern, 0.47, 0.45);
            box2(lantern, graphite, [0, 0.027, 0], 0.26, 0.054, 0.26);
            box2(lantern, lanternGlass, [0, 0.163, 0], 0.169, 0.231, 0.168, unrotated, false);
            try {
                for (var _w = __values([-0.098, 0.098]), _x = _w.next(); !_x.done; _x = _w.next()) {
                    var x = _x.value;
                    try {
                        for (var _y = (e_89 = void 0, __values([-0.098, 0.098])), _z = _y.next(); !_z.done; _z = _y.next()) {
                            var z = _z.value;
                            box2(lantern, graphite, [x, 0.166, z], 0.024, 0.234, 0.024);
                        }
                    }
                    catch (e_89_1) { e_89 = { error: e_89_1 }; }
                    finally {
                        try {
                            if (_z && !_z.done && (_j = _y.return)) _j.call(_y);
                        }
                        finally { if (e_89) throw e_89.error; }
                    }
                }
            }
            catch (e_88_1) { e_88 = { error: e_88_1 }; }
            finally {
                try {
                    if (_x && !_x.done && (_h = _w.return)) _h.call(_w);
                }
                finally { if (e_88) throw e_88.error; }
            }
            box2(lantern, graphite, [0, 0.291, 0], 0.245, 0.04, 0.245);
            var handle = new THREE.TorusGeometry(0.046, 9e-3, 5, 12, Math.PI);
            place(lantern, handle, agedMetal, 0, 0.312, 0, false);
            var spill = new THREE.PointLight("#ffb478", 0.8, 1.6, 2);
            spill.position.set(0, 0.24, 0);
            spill.userData.airGlow = 1;
            lantern.add(spill);
            var candle = frame(-2.84, 4.59, 0, 0.725);
            detail(candle, tubeShape, ceramicGreen, [0, 0.022, 0], [0.049, 0.042, 0.049]);
            detail(candle, tubeShape, lanternGlass, [0, 0.065, 0], [0.033, 0.054, 0.033], unrotated, false);
            oval(candle, lanternGlass, [0, 0.099, 0], 8e-3, 0.017, 8e-3);
            var skinWarm = material("#c79a7f");
            var skinCool = material("#b88d74");
            var hairDark = material("#312c36");
            var hairBrown = material("#4c3b38");
            var shoeBlack = material("#363741");
            var soles = material("#857a75");
            var denim = material("#5d6b78");
            var darkPants = material("#444653");
            var raincoat = material("#b18b55", { roughness: 0.54 });
            var rainSeams = material("#d5aa6c", { roughness: 0.59 });
            var burgundy = material("#a47372");
            var burgundyTrim = material("#684d60");
            var indigo = material("#55667f");
            var indigoTrim = material("#3e485b");
            function garment(host, finish, profile) {
                var e_93, _d;
                var positions = [];
                var triangles = [];
                var sides = 12;
                try {
                    for (var profile_1 = __values(profile), profile_1_1 = profile_1.next(); !profile_1_1.done; profile_1_1 = profile_1.next()) {
                        var _e = __read(profile_1_1.value, 4), y = _e[0], width = _e[1], depth = _e[2], center = _e[3];
                        for (var i = 0; i < sides; i++) {
                            var a = i / sides * Math.PI * 2;
                            positions.push(width * Math.cos(a), y, center + depth * Math.sin(a));
                        }
                    }
                }
                catch (e_93_1) { e_93 = { error: e_93_1 }; }
                finally {
                    try {
                        if (profile_1_1 && !profile_1_1.done && (_d = profile_1.return)) _d.call(profile_1);
                    }
                    finally { if (e_93) throw e_93.error; }
                }
                for (var row = 0; row < profile.length - 1; row++) {
                    for (var i = 0; i < sides; i++) {
                        var lower = row * sides + i;
                        var next = row * sides + (i + 1) % sides;
                        triangles.push(lower, lower + sides, next + sides, lower, next + sides, next);
                    }
                }
                var shape = new THREE.BufferGeometry();
                shape.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
                shape.setIndex(triangles);
                shape.computeVertexNormals();
                place(host, shape, finish, 0, 0, 0);
            }
            function head(host, y, z, angle, skin, hair, bun) {
                var e_94, _d;
                if (bun === void 0) { bun = false; }
                var orientation = yaw(angle);
                var facePoint = function (x, dy, dz) { return new THREE.Vector3(x, dy, dz).applyQuaternion(orientation).add(new THREE.Vector3(0, y, z)).toArray(); };
                segment(host, skin, [0, y - 0.17, z], [0, y - 0.07, z], 0.051);
                oval(host, skin, facePoint(0, 0, 0), 0.092, 0.12, 0.097, orientation);
                oval(host, hair, facePoint(0, 0.055, -0.034), 0.102, 0.087, 0.096, orientation);
                oval(host, hair, facePoint(-0.057, 0.056, 0.012), 0.055, 0.065, 0.087, orientation);
                oval(host, hair, facePoint(0.034, 0.084, 0.045), 0.06, 0.045, 0.051, orientation);
                oval(host, skin, facePoint(0, -6e-3, 0.095), 0.021, 0.027, 0.022, orientation);
                try {
                    for (var _e = __values([-1, 1]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var sign = _f.value;
                        oval(host, skin, facePoint(sign * 0.085, -8e-3, 0), 0.019, 0.029, 0.021, orientation);
                        oval(host, hair, facePoint(sign * 0.034, 0.015, 0.088), 0.012, 6e-3, 4e-3, orientation);
                    }
                }
                catch (e_94_1) { e_94 = { error: e_94_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_94) throw e_94.error; }
                }
                if (bun)
                    oval(host, hair, facePoint(0.012, 0.028, -0.128), 0.065, 0.056, 0.057, orientation);
            }
            function arm(host, cloth, cuff, skin, shoulder, elbow, wrist, radius) {
                segment(host, cloth, shoulder, elbow, radius, true);
                oval(host, cloth, elbow, radius * 0.74, radius * 0.76, radius * 0.77);
                segment(host, cloth, elbow, wrist, radius * 0.81, true);
                segment(host, cuff, elbow.map(function (p, i) { return THREE.MathUtils.lerp(p, wrist[i], 0.85); }), wrist, radius * 0.66);
                oval(host, skin, [wrist[0], wrist[1] - 0.024, wrist[2] + 0.015], 0.038, 0.051, 0.039);
            }
            function leg(host, cloth, hip, knee, ankle) {
                segment(host, cloth, hip, knee, 0.09, true);
                oval(host, cloth, knee, 0.068, 0.071, 0.07);
                segment(host, cloth, knee, ankle, 0.071, true);
            }
            function shoe(host, x, y, z, turn, finish) {
                if (turn === void 0) { turn = 0; }
                if (finish === void 0) { finish = shoeBlack; }
                var rotation = yaw(turn);
                oval(host, soles, [x, y + 0.016, z + 0.032], 0.068, 0.016, 0.133, rotation);
                oval(host, finish, [x, y + 0.051, z + 0.025], 0.066, 0.052, 0.122, rotation);
            }
            var reader = frame(-3.18, 11.28, Math.PI / 2 + 0.028);
            groundShadow(reader, 0.7, 0.62, 0, 0.53);
            garment(reader, indigo, [
                [0.46, 2e-3, 2e-3, 0.015],
                [0.47, 0.17, 0.11, 0.015],
                [0.6, 0.145, 0.113, 0.028],
                [0.74, 0.174, 0.114, 0.012],
                [0.86, 0.19, 0.101, -4e-3],
                [0.92, 0.118, 0.082, -1e-3],
                [0.95, 2e-3, 2e-3, 0.01]
            ]);
            head(reader, 1.057, 0.03, 0.21, skinWarm, hairBrown);
            try {
                for (var _0 = __values([-1, 1]), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                    var side = _1.value;
                    var x = side * 0.106;
                    var reach = side * 0.04;
                    leg(reader, darkPants, [x, 0.472, 0.04], [x + reach, 0.435, 0.365], [x + reach, 0.083, 0.496]);
                    shoe(reader, x + reach, 0, 0.512, side * 0.12);
                    arm(reader, indigo, indigoTrim, skinWarm, [side * 0.16, 0.85, 6e-3], [side * 0.222, 0.627, 0.116], [side * 0.139, 0.632, 0.322], 0.07);
                }
            }
            catch (e_90_1) { e_90 = { error: e_90_1 }; }
            finally {
                try {
                    if (_1 && !_1.done && (_k = _0.return)) _k.call(_0);
                }
                finally { if (e_90) throw e_90.error; }
            }
            var bookCloth = material("#797d62");
            var bookTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.29, -0.09, 0.04));
            box2(reader, bookCloth, [0, 0.616, 0.355], 0.296, 0.027, 0.186, bookTilt);
            box2(reader, cream, [0, 0.636, 0.352], 0.281, 0.021, 0.17, bookTilt, false);
            box2(reader, tan, [0, 0.653, 0.35], 9e-3, 0.01, 0.167, bookTilt, false);
            var customer = frame(-2.03, 5.33, -1.24);
            groundShadow(customer, 0.56, 0.69);
            garment(customer, burgundy, [
                [0.773, 2e-3, 2e-3, 0],
                [0.79, 0.159, 0.102, 0],
                [0.91, 0.143, 0.112, -9e-3],
                [1.1, 0.157, 0.104, -0.012],
                [1.283, 0.184, 0.09, -0.012],
                [1.346, 0.108, 0.077, -7e-3],
                [1.368, 2e-3, 2e-3, 0]
            ]);
            head(customer, 1.481, -7e-3, 0.16, skinWarm, hairBrown, true);
            leg(customer, denim, [-0.095, 0.827, 0], [-0.109, 0.451, 0.049], [-0.113, 0.101, 0.066]);
            leg(customer, denim, [0.093, 0.822, -5e-3], [0.108, 0.453, -0.057], [0.126, 0.101, -0.086]);
            shoe(customer, -0.113, 0, 0.071, -0.14);
            shoe(customer, 0.126, 0, -0.086, 0.2);
            arm(customer, burgundy, burgundyTrim, skinWarm, [-0.163, 1.28, -0.013], [-0.215, 1.05, 0.026], [-0.157, 1.106, 0.233], 0.068);
            arm(customer, burgundy, burgundyTrim, skinWarm, [0.163, 1.275, -7e-3], [0.21, 1.057, -0.063], [0.211, 0.847, -0.012], 0.068);
            segment(customer, burgundyTrim, [-0.072, 1.37, 0.013], [0.074, 1.37, 0.012], 0.054);
            segment(customer, tan, [0.129, 1.295, 0.055], [0.218, 0.862, 0.145], 0.016, false, false);
            box2(customer, tan, [0.217, 0.789, 0.136], 0.177, 0.193, 0.108, yaw(-0.13));
            box2(customer, cream, [0.218, 0.814, 0.195], 0.135, 0.071, 0.013, yaw(-0.13), false);
            detail(customer, taperedTube, cream, [-0.155, 1.136, 0.255], [0.041, 0.104, 0.041], new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI));
            detail(customer, tubeShape, graphite, [-0.155, 1.19, 0.255], [0.042, 0.018, 0.042]);
            var walker = frame(9.4, -0.76, 0.64);
            groundShadow(walker, 0.61, 0.81, -0.012, 0.038);
            garment(walker, raincoat, [
                [0.64, 2e-3, 2e-3, -0.026],
                [0.655, 0.173, 0.111, -0.025],
                [0.88, 0.154, 0.115, -0.018],
                [1.085, 0.152, 0.105, -0.01],
                [1.275, 0.184, 0.1, -5e-3],
                [1.337, 0.111, 0.083, 3e-3],
                [1.357, 2e-3, 2e-3, 7e-3]
            ]);
            head(walker, 1.468, 0.02, -0.085, skinCool, hairDark);
            oval(walker, raincoat, [0, 1.313, -0.076], 0.132, 0.129, 0.098);
            segment(walker, rainSeams, [0.013, 0.678, 0.087], [0.015, 1.244, 0.103], 9e-3, false, false);
            leg(walker, darkPants, [-0.093, 0.763, -0.021], [-0.114, 0.43, 0.185], [-0.115, 0.095, 0.291]);
            leg(walker, darkPants, [0.083, 0.768, -0.018], [0.141, 0.449, -0.032], [0.13, 0.137, -0.201]);
            shoe(walker, -0.115, 0, 0.308, -0.1);
            shoe(walker, 0.13, 0.038, -0.19, 0.19);
            arm(walker, raincoat, rainSeams, skinCool, [-0.16, 1.262, -0.014], [-0.208, 1.038, -0.094], [-0.184, 0.848, -0.129], 0.072);
            arm(walker, raincoat, rainSeams, skinCool, [0.16, 1.261, 3e-3], [0.218, 1.061, 0.111], [0.183, 1.211, 0.225], 0.07);
            var canopyCenter = new THREE.Vector3(0.096, 1.946, 0.157);
            var canopyTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.085, 0, 0.122));
            var canopyPoint = function (x, y, z) { return new THREE.Vector3(x, y, z).applyQuaternion(canopyTilt).add(canopyCenter).toArray(); };
            var canopyShape = new THREE.BufferGeometry();
            var canopyPositions = [];
            var canopyColors = [];
            var canopyIndices = [];
            var ribCount = 8;
            var subdivisions = 5;
            var rings = 5;
            function umbrellaPoint(f, a) {
                var hem = 1 - 0.048 * Math.pow(Math.sin(a * ribCount / 2), 2) * f * f;
                var radius = 0.555 * f * hem;
                return canopyPoint(Math.cos(a) * radius, -0.228 * f * f + (1 - hem) * 0.42, Math.sin(a) * radius);
            }
            for (var rib = 0; rib < ribCount; rib++) {
                var color = new THREE.Color(rib % 2 ? "#b7cfdf" : "#a7c7d3");
                var base = canopyPositions.length / 3;
                for (var row = 0; row <= rings; row++) {
                    for (var step = 0; step <= subdivisions; step++) {
                        var angle = (rib + step / subdivisions) / ribCount * Math.PI * 2;
                        canopyPositions.push.apply(canopyPositions, __spreadArray([], __read(umbrellaPoint(Math.max(5e-4, row / rings), angle)), false));
                        canopyColors.push(color.r, color.g, color.b);
                        if (row < rings && step < subdivisions) {
                            var a = base + row * (subdivisions + 1) + step;
                            var b = a + subdivisions + 1;
                            canopyIndices.push(a, a + 1, b, a + 1, b + 1, b);
                        }
                    }
                }
            }
            canopyShape.setAttribute("position", new THREE.Float32BufferAttribute(canopyPositions, 3));
            canopyShape.setAttribute("color", new THREE.Float32BufferAttribute(canopyColors, 3));
            canopyShape.setIndex(canopyIndices);
            canopyShape.computeVertexNormals();
            var vinyl = new THREE.MeshPhysicalMaterial({
                vertexColors: true,
                roughness: 0.24,
                clearcoat: 0.83,
                clearcoatRoughness: 0.22,
                transparent: true,
                opacity: 0.4,
                depthWrite: false,
                side: THREE.DoubleSide,
                forceSinglePass: true
            });
            var umbrella = place(walker, canopyShape, vinyl, 0, 0, 0, false);
            umbrella.renderOrder = 2;
            var umbrellaRib = material("#aac0c7", { roughness: 0.47, metalness: 0.3 });
            for (var rib = 0; rib < ribCount; rib++) {
                var a = rib / ribCount * Math.PI * 2;
                for (var i = 0; i < 4; i++) {
                    segment(walker, umbrellaRib, umbrellaPoint(i / 4, a), umbrellaPoint((i + 1) / 4, a), 6e-3, false, false);
                    var next = (rib + (i + 1) / 4) / ribCount * Math.PI * 2;
                    var start = (rib + i / 4) / ribCount * Math.PI * 2;
                    segment(walker, umbrellaRib, umbrellaPoint(1, start), umbrellaPoint(1, next), 7e-3, false, false);
                }
                oval(walker, graphite, umbrellaPoint(1, a), 0.016, 0.014, 0.017);
            }
            segment(walker, agedMetal, [0.184, 1.184, 0.228], canopyCenter.toArray(), 0.012, false, false);
            segment(walker, graphite, [0.185, 1.143, 0.232], [0.185, 1.231, 0.223], 0.021);
            segment(walker, graphite, [0.185, 1.143, 0.232], [0.187, 1.119, 0.263], 0.019);
            oval(walker, graphite, canopyPoint(0, 0.013, 0), 0.016, 0.035, 0.016);
            try {
                for (var _2 = __values(detailBatches.values()), _3 = _2.next(); !_3.done; _3 = _2.next()) {
                    var _4 = _3.value, geometry = _4.geometry, finish = _4.finish, cast = _4.cast, matrices = _4.matrices, colors = _4.colors;
                    var batch = new THREE.InstancedMesh(geometry, finish, matrices.length);
                    batch.castShadow = cast;
                    batch.receiveShadow = true;
                    for (var i = 0; i < matrices.length; i++) {
                        batch.setMatrixAt(i, matrices[i]);
                        if (colors[i])
                            batch.setColorAt(i, colors[i]);
                    }
                    streetLife.add(batch);
                }
            }
            catch (e_91_1) { e_91 = { error: e_91_1 }; }
            finally {
                try {
                    if (_3 && !_3.done && (_l = _2.return)) _l.call(_2);
                }
                finally { if (e_91) throw e_91.error; }
            }
        }
        function buildCafe(parent, lightPaint2) {
            var e_95, _d, e_96, _e, e_97, _f, e_98, _g, e_99, _h, e_100, _j, e_101, _k, _l, _m, _o, _p, e_102, _q, e_103, _r, e_104, _s, e_105, _t, e_106, _u, e_107, _v, e_108, _w, e_109, _x, e_110, _y, e_111, _z, e_112, _0, e_113, _1, e_114, _2;
            var cafe = new THREE.Group();
            cafe.position.set(-5.73, 0.18, 4.12);
            cafe.name = "\u5915\u51EA\u73C8\u7432\u5E97";
            parent.add(cafe);
            var cream = 15254685;
            var pale = 15915696;
            var wood = 9269605;
            var amberWood = 10714470;
            var teal = 6651511;
            var lightTeal = 8623242;
            var blackMetal = 3421496;
            var railMetal = 6711656;
            var roofTrim = 6978685;
            var awningRed = 10305849;
            var awningLight = 12016459;
            var materialCache = new Map();
            var cylinderCache = new Map();
            var batches = new Map();
            var unitBox = new THREE.BoxGeometry(1, 1, 1);
            var up = new THREE.Vector3(0, 1, 0);
            var identity = new THREE.Quaternion();
            function finish(color) {
                if (!materialCache.has(color)) {
                    materialCache.set(color, new THREE.MeshStandardMaterial({ color: color, roughness: 0.83 }));
                }
                return materialCache.get(color);
            }
            function mesh(host, geometry, material2, x, y, z, cast) {
                if (cast === void 0) { cast = true; }
                var resolvedMaterial = typeof material2 === "number" ? finish(material2) : material2;
                var part = new THREE.Mesh(geometry, resolvedMaterial);
                part.position.set(x, y, z);
                part.castShadow = cast;
                part.receiveShadow = true;
                host.add(part);
                return part;
            }
            function staticPart(host, geometry, color, position, rotation, scale, cast) {
                if (cast === void 0) { cast = true; }
                var material2 = finish(color);
                var key = "".concat(host.id, "/").concat(geometry.id, "/").concat(material2.id, "/").concat(cast);
                if (!batches.has(key))
                    batches.set(key, { host: host, geometry: geometry, material: material2, cast: cast, transforms: [] });
                batches.get(key).transforms.push(new THREE.Matrix4().compose(position, rotation, scale));
            }
            function box2(host, x, y, z, w, h, d, material2, cast) {
                if (cast === void 0) { cast = true; }
                staticPart(host, unitBox, material2, new THREE.Vector3(x, y, z), identity, new THREE.Vector3(w, h, d), cast);
            }
            function tube2(host, a, b, radius, color, segments) {
                var _d, _e;
                if (segments === void 0) { segments = 8; }
                var start = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(a), false)))();
                var end = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(b), false)))();
                var delta = end.clone().sub(start);
                var midpoint = start.addScaledVector(delta, 0.5);
                var length = delta.length();
                var rotation = new THREE.Quaternion().setFromUnitVectors(up, delta.normalize());
                if (!cylinderCache.has(segments))
                    cylinderCache.set(segments, new THREE.CylinderGeometry(1, 1, 1, segments));
                staticPart(host, cylinderCache.get(segments), color, midpoint, rotation, new THREE.Vector3(radius, length, radius));
            }
            function panel(host, x, y, z, width2, height, image2, intensity) {
                if (intensity === void 0) { intensity = 0.38; }
                var material2 = new THREE.MeshStandardMaterial({
                    map: image2,
                    emissiveMap: image2,
                    emissive: 16772048,
                    emissiveIntensity: intensity,
                    roughness: 0.72,
                    metalness: 0.01
                });
                return mesh(host, new THREE.PlaneGeometry(width2, height), material2, x, y, z, false);
            }
            function image(width2, height, paint) {
                var canvas = document.createElement("canvas");
                canvas.width = width2;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                paint(ctx, width2, height);
                var texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.anisotropy = 4;
                return texture;
            }
            var storefrontSign = image(768, 160, function (ctx, w, h) {
                var e_115, _d;
                ctx.fillStyle = "#51342b";
                ctx.fillRect(0, 0, w, h);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#b78358";
                ctx.strokeRect(9, 9, w - 18, h - 18);
                ctx.strokeStyle = "#885840";
                ctx.strokeRect(15, 15, w - 30, h - 30);
                ctx.fillStyle = "#f6d69d";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = 'bold 84px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif';
                ctx.fillText("\u5915 \u51EA \u73C8 \u7432 \u5E97", w / 2, 81);
                ctx.font = "bold 18px Georgia, serif";
                ctx.fillText("Y U N A G I   C O F F E E", w / 2, 129);
                try {
                    for (var _e = __values([65, w - 65]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var x = _f.value;
                        ctx.beginPath();
                        ctx.moveTo(x, 68);
                        ctx.lineTo(x + 10, 82);
                        ctx.lineTo(x, 96);
                        ctx.lineTo(x - 10, 82);
                        ctx.fill();
                    }
                }
                catch (e_115_1) { e_115 = { error: e_115_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_115) throw e_115.error; }
                }
            });
            var lightboxSign = image(192, 384, function (ctx, w, h) {
                ctx.fillStyle = "#f5c27e";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#aa5a3d";
                ctx.lineWidth = 5;
                ctx.strokeRect(12, 12, w - 24, h - 24);
                ctx.fillStyle = "#71372d";
                ctx.strokeStyle = "#71372d";
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.ellipse(88, 79, 39, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeRect(50, 81, 76, 32);
                ctx.beginPath();
                ctx.arc(129, 91, 14, -1.6, 1.4);
                ctx.stroke();
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = 'bold 92px "Yu Mincho", "Hiragino Mincho ProN", serif';
                ctx.fillText("\u73C8", 96, 183);
                ctx.fillText("\u7432", 96, 279);
                ctx.font = "bold 18px Georgia, serif";
                ctx.fillText("COFFEE", 96, 344);
            });
            var menu = image(176, 244, function (ctx, w, h) {
                ctx.fillStyle = "#30413c";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#c5a373";
                ctx.lineWidth = 2;
                ctx.strokeRect(8, 8, w - 16, h - 16);
                ctx.textAlign = "center";
                ctx.fillStyle = "#f0d4a1";
                ctx.font = 'bold 23px "Yu Gothic", sans-serif';
                ctx.fillText("\u672C\u65E5\u306E\u73C8\u7432", w / 2, 46);
                ctx.strokeStyle = "#b9ad86";
                ctx.beginPath();
                ctx.moveTo(24, 68);
                ctx.lineTo(152, 68);
                ctx.stroke();
                ctx.font = '17px "Yu Gothic", sans-serif';
                ctx.fillText("\u30D6\u30EC\u30F3\u30C9   450", w / 2, 99);
                ctx.fillText("\u30AB\u30D5\u30A7\u30AA\u30EC  500", w / 2, 131);
                ctx.fillText("\u30D7\u30EA\u30F3      380", w / 2, 162);
                ctx.font = "italic 17px Georgia, serif";
                ctx.fillText("Open 11\u201319", w / 2, 211);
            });
            var width = 4.5;
            var depth = 4;
            var groundFloor = 0.28;
            var upperFloor = 2.68;
            var foundation = 8745318;
            box2(cafe, 0, groundFloor / 2, 0, width + 0.13, groundFloor, depth + 0.12, foundation);
            box2(cafe, 0, 2.46, 0, width + 0.11, 0.11, depth + 0.11, amberWood);
            box2(cafe, 0, 2.54, 0, width + 0.095, 0.044, depth + 0.095, 12818550);
            box2(cafe, 0, 4.83, 0, width + 0.11, 0.115, depth + 0.12, wood);
            box2(cafe, 0, 4.91, 0, width + 0.4, 0.058, depth + 0.4, 13151377);
            box2(cafe, 0, 4.97, 0, width + 0.02, 0.22, depth + 0.02, 11833719);
            var front = new THREE.Group();
            front.position.z = depth / 2;
            cafe.add(front);
            var east = new THREE.Group();
            east.position.x = width / 2;
            east.rotation.y = Math.PI / 2;
            cafe.add(east);
            var back = new THREE.Group();
            back.position.z = -depth / 2;
            back.rotation.y = Math.PI;
            cafe.add(back);
            var west = new THREE.Group();
            west.position.x = -width / 2;
            west.rotation.y = -Math.PI / 2;
            cafe.add(west);
            function facadeWall(face, faceWidth, lowerY, upperY, openings, wallColor) {
                var e_116, _d;
                var thickness = 0.1;
                var z = -thickness / 2;
                var sortedY = [lowerY, upperY];
                try {
                    for (var _e = __values(openings.filter(function (hole) { return hole.y0 < upperY && hole.y1 > lowerY; })), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var opening = _f.value;
                        sortedY.push(Math.max(lowerY, opening.y0), Math.min(upperY, opening.y1));
                    }
                }
                catch (e_116_1) { e_116 = { error: e_116_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_116) throw e_116.error; }
                }
                var cutsY = __spreadArray([], __read(new Set(sortedY)), false).sort(function (a, b) { return a - b; });
                var _loop_12 = function (row) {
                    var e_117, _g, e_118, _h;
                    var y0 = cutsY[row];
                    var y1 = cutsY[row + 1];
                    var midY = (y0 + y1) / 2;
                    var cutsX = openings.filter(function (hole) { return midY > hole.y0 && midY < hole.y1; }).map(function (_d) {
                        var x0 = _d.x0, x1 = _d.x1;
                        return [x0, x1];
                    }).sort(function (a, b) { return a[0] - b[0]; });
                    var merged = [];
                    try {
                        for (var cutsX_1 = (e_117 = void 0, __values(cutsX)), cutsX_1_1 = cutsX_1.next(); !cutsX_1_1.done; cutsX_1_1 = cutsX_1.next()) {
                            var _j = __read(cutsX_1_1.value, 2), x0 = _j[0], x1 = _j[1];
                            var last = merged[merged.length - 1];
                            if (last && x0 <= last[1])
                                last[1] = Math.max(last[1], x1);
                            else
                                merged.push([x0, x1]);
                        }
                    }
                    catch (e_117_1) { e_117 = { error: e_117_1 }; }
                    finally {
                        try {
                            if (cutsX_1_1 && !cutsX_1_1.done && (_g = cutsX_1.return)) _g.call(cutsX_1);
                        }
                        finally { if (e_117) throw e_117.error; }
                    }
                    var cursor = -faceWidth / 2;
                    try {
                        for (var merged_1 = (e_118 = void 0, __values(merged)), merged_1_1 = merged_1.next(); !merged_1_1.done; merged_1_1 = merged_1.next()) {
                            var _k = __read(merged_1_1.value, 2), x0 = _k[0], x1 = _k[1];
                            if (x0 > cursor)
                                box2(face, (cursor + x0) / 2, midY, z, x0 - cursor, y1 - y0, thickness, wallColor);
                            cursor = Math.max(cursor, x1);
                        }
                    }
                    catch (e_118_1) { e_118 = { error: e_118_1 }; }
                    finally {
                        try {
                            if (merged_1_1 && !merged_1_1.done && (_h = merged_1.return)) _h.call(merged_1);
                        }
                        finally { if (e_118) throw e_118.error; }
                    }
                    if (cursor < faceWidth / 2)
                        box2(face, (cursor + faceWidth / 2) / 2, midY, z, faceWidth / 2 - cursor, y1 - y0, thickness, wallColor);
                };
                for (var row = 0; row < cutsY.length - 1; row++) {
                    _loop_12(row);
                }
            }
            var frontOpenings = [
                { x0: -1.975, x1: 0.175, y0: 0.53, y1: 1.83 },
                { x0: 0.575, x1: 1.565, y0: groundFloor, y1: 2.17 },
                { x0: -1.76, x1: -0.54, y0: 3, y1: 4.34 },
                { x0: 0.165, x1: 1.595, y0: 2.68, y1: 4.61 }
            ];
            var eastOpenings = [
                { x0: -1.52, x1: -0.04, y0: 0.57, y1: 1.89 },
                { x0: 0.405, x1: 1.575, y0: 0.875, y1: 1.805 },
                { x0: -1.525, x1: -0.235, y0: 3.08, y1: 4.34 },
                { x0: 0.25, x1: 1.49, y0: 3.08, y1: 4.34 }
            ];
            var westOpenings = [{ x0: -0.13, x1: 1.29, y0: 3.075, y1: 4.305 }];
            var backOpenings = [
                { x0: 0.05, x1: 0.91, y0: groundFloor, y1: 2.1 },
                { x0: -1.505, x1: -0.315, y0: 3.115, y1: 4.265 },
                { x0: 0.28, x1: 1.32, y0: 3.115, y1: 4.265 }
            ];
            try {
                for (var _3 = __values([
                    [front, width, frontOpenings],
                    [back, width, backOpenings],
                    [east, depth, eastOpenings],
                    [west, depth, westOpenings]
                ]), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                    var _5 = __read(_4.value, 3), face = _5[0], faceWidth = _5[1], openings = _5[2];
                    facadeWall(face, faceWidth, groundFloor, 2.38, openings, cream);
                    facadeWall(face, faceWidth, 2.54, 4.835, openings, pale);
                }
            }
            catch (e_95_1) { e_95 = { error: e_95_1 }; }
            finally {
                try {
                    if (_4 && !_4.done && (_d = _3.return)) _d.call(_3);
                }
                finally { if (e_95) throw e_95.error; }
            }
            var openingTrimGroups = new WeakMap();
            function openingTrim(face) {
                var trim = openingTrimGroups.get(face);
                if (!trim) {
                    trim = new THREE.Group();
                    trim.userData.windowAndDoorTrim = true;
                    face.add(trim);
                    openingTrimGroups.set(face, trim);
                }
                return trim;
            }
            function windowUnit(face, x, y, w, h, options) {
                var e_119, _d, e_120, _e, e_121, _f;
                if (options === void 0) { options = {}; }
                var _a, _b, _c;
                var joinery = openingTrim(face);
                var trim = (_a = options.trim) != null ? _a : teal;
                var center = (_b = options.transom) != null ? _b : false;
                var light = (_c = options.light) != null ? _c : 0.52;
                try {
                    for (var _g = __values([-1, 1]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var side = _h.value;
                        box2(joinery, x + side * (w / 2 + 0.029), y, 0.047, 0.064, h + 0.12, 0.1, trim);
                        box2(joinery, x, y + side * (h / 2 + 0.026), 0.047, w, 0.059, 0.1, wood);
                    }
                }
                catch (e_119_1) { e_119 = { error: e_119_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_119) throw e_119.error; }
                }
                var glass = new THREE.MeshStandardMaterial({
                    color: 14928042,
                    emissive: 16760193,
                    emissiveIntensity: light * 0.52,
                    roughness: 0.36,
                    metalness: 0.04,
                    transparent: true,
                    opacity: 0.18,
                    depthWrite: false
                });
                try {
                    for (var _j = __values([-1, 1]), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var side = _k.value;
                        box2(joinery, x + side * (w / 2 - 0.025), y, -0.25, 0.06, h, 0.52, 10190956, false);
                    }
                }
                catch (e_120_1) { e_120 = { error: e_120_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                    }
                    finally { if (e_120) throw e_120.error; }
                }
                box2(joinery, x, y + h / 2 - 0.025, -0.25, w - 0.11, 0.06, 0.52, 10190956, false);
                box2(joinery, x, y - h / 2 + 0.025, -0.25, w - 0.11, 0.06, 0.52, 10583908, false);
                var pane = mesh(face, new THREE.PlaneGeometry(w - 0.025, h - 0.027), glass, x, y, 0.086, false);
                pane.receiveShadow = false;
                box2(joinery, x, y, 0.12, 0.032, h, 0.028, trim);
                if (center) {
                    var railWidth = (w - 0.032) / 2;
                    try {
                        for (var _l = __values([-1, 1]), _m = _l.next(); !_m.done; _m = _l.next()) {
                            var side = _m.value;
                            box2(joinery, x + side * (0.016 + railWidth / 2), y + h * 0.24, 0.12, railWidth, 0.036, 0.028, trim);
                        }
                    }
                    catch (e_121_1) { e_121 = { error: e_121_1 }; }
                    finally {
                        try {
                            if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                        }
                        finally { if (e_121) throw e_121.error; }
                    }
                }
                box2(joinery, x, y - h / 2 - 0.052, 0.101, w + 0.16, 0.058, 0.207, trim);
                box2(joinery, x, y + h / 2 + 0.048, 0.076, w + 0.14, 0.04, 0.125, trim);
            }
            function entrance(face, x, floor, w, h, intensity, sliding) {
                var e_122, _d, e_123, _e;
                if (sliding === void 0) { sliding = false; }
                var joinery = openingTrim(face);
                var y = floor + h / 2;
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        box2(joinery, x + side * (w / 2 + 0.024), y + 0.029, 0.074, 0.075, h + 0.057, 0.15, wood);
                        box2(joinery, x + side * (w / 2 - 0.053), y + 0.026, 0.142, 0.06, h - 0.063, 0.052, teal);
                    }
                }
                catch (e_122_1) { e_122 = { error: e_122_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_122) throw e_122.error; }
                }
                box2(joinery, x, y + h / 2 + 0.018, 0.095, w + 0.11, 0.073, 0.13, wood);
                var doorGlass = new THREE.MeshStandardMaterial({
                    color: 12891039,
                    emissive: 16759165,
                    emissiveIntensity: intensity * 0.38,
                    roughness: 0.4,
                    metalness: 0.025,
                    transparent: true,
                    opacity: 0.19,
                    depthWrite: false
                });
                try {
                    for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var side = _j.value;
                        box2(joinery, x + side * (w / 2 - 0.025), y, -0.25, 0.06, h, 0.52, 9598561, false);
                    }
                }
                catch (e_123_1) { e_123 = { error: e_123_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_123) throw e_123.error; }
                }
                box2(joinery, x, y + h / 2 - 0.025, -0.25, w - 0.11, 0.06, 0.52, 9598561, false);
                mesh(face, new THREE.PlaneGeometry(w - 0.13, h - 0.32), doorGlass, x, y + 0.116, 0.165, false).receiveShadow = false;
                if (!sliding) {
                    box2(joinery, x, y + 0.116, 0.204, 0.025, h - 0.36, 0.024, teal, false);
                    box2(joinery, x, floor + 0.34, 0.205, w - 0.18, 0.025, 0.024, teal, false);
                }
                box2(joinery, x, floor + 0.124, 0.177, w - 0.092, 0.204, 0.027, lightTeal);
                box2(joinery, x, floor + 0.015, 0.131, w + 0.13, 0.03, 0.22, amberWood);
                if (sliding)
                    box2(joinery, x, y + 0.05, 0.179, 0.035, h - 0.082, 0.029, teal);
                box2(joinery, x + (sliding ? -0.08 : w * 0.35), y - 0.07, 0.203, 0.036, 0.125, 0.038, 13738858);
            }
            function entrySteps(face, x, w) {
                var joinery = openingTrim(face);
                box2(joinery, x, groundFloor * 0.24, 0.3825, w + 0.13, groundFloor * 0.52, 0.765, foundation, false);
                box2(joinery, x, groundFloor * 0.75, 0.24, w + 0.1, groundFloor * 0.5, 0.48, foundation, false);
            }
            function interiorFurniture() {
                var e_124, _d, e_125, _e, e_126, _f, e_127, _g, e_128, _h, e_129, _j;
                var floorWood = 8413260;
                var darkWood = 5585199;
                var upholstery = 9263431;
                var brass = 11766363;
                var tableTop2 = new THREE.CylinderGeometry(0.34, 0.34, 0.075, 16);
                var cupBody = new THREE.CylinderGeometry(0.043, 0.038, 0.075, 10);
                var warmBulb = new THREE.MeshStandardMaterial({
                    color: 16765316,
                    emissive: 16753486,
                    emissiveIntensity: 1.1,
                    roughness: 0.35
                });
                var glassCase = new THREE.MeshPhysicalMaterial({
                    color: 15979432,
                    transparent: true,
                    opacity: 0.16,
                    roughness: 0.12,
                    metalness: 0.02,
                    depthWrite: false,
                    side: THREE.DoubleSide
                });
                box2(cafe, 0, 0.345, 0, width - 0.2, 0.13, depth - 0.2, floorWood, false);
                box2(cafe, 0.485, 2.535, 0, 3.28, 0.13, depth - 0.2, floorWood, false);
                box2(cafe, -2.04, 2.535, 0, 0.14, 0.13, depth - 0.2, floorWood, false);
                box2(cafe, -1.6, 2.535, -1.53, 0.76, 0.13, 0.7, floorWood, false);
                box2(cafe, -1.6, 2.535, 1.25, 0.76, 0.13, 0.9, floorWood, false);
                for (var i = 0; i < 13; i++) {
                    var y = 0.405 + i * 0.174;
                    var z = -1.25 + i * 0.145;
                    box2(cafe, -1.62, y, z, 0.7, 0.13, 0.215, i % 2 ? 7557439 : 8413260, false);
                }
                tube2(cafe, [-2, 0.47, -1.31], [-2, 2.43, 0.49], 0.026, brass, 8);
                tube2(cafe, [-1.24, 0.47, -1.31], [-1.24, 2.43, 0.49], 0.026, brass, 8);
                for (var i = 0; i < 7; i++) {
                    var t = i / 6;
                    var y = 0.62 + t * 1.57;
                    var z = -1.12 + t * 1.5;
                    tube2(cafe, [-2, y, z], [-1.24, y, z], 0.016, brass, 6);
                }
                box2(cafe, -0.91, 0.79, 1.23, 1.72, 0.72, 0.46, darkWood, false);
                box2(cafe, -0.91, 1.18, 1.23, 1.84, 0.09, 0.55, 11634530, false);
                lightPaint2.add(cafe, [-0.66, 1.23, 1.24], [1.08, 0.49], "#ffc387", 0.57, true);
                box2(cafe, -0.91, 0.95, 0.94, 1.7, 0.055, 0.035, brass, false);
                box2(cafe, -0.34, 1.36, 1.25, 0.4, 0.28, 0.34, 3421496, false);
                box2(cafe, -0.34, 1.52, 1.25, 0.27, 0.055, 0.25, 7828331, false);
                tube2(cafe, [-0.47, 1.3, 1.25], [-0.47, 1.18, 1.25], 0.025, brass, 8);
                box2(cafe, -1.36, 1.35, 1.25, 0.62, 0.25, 0.38, 7819327, false);
                box2(cafe, -1.36, 1.49, 1.25, 0.67, 0.035, 0.43, 13081192, false);
                try {
                    for (var _k = __values([-1.57, -1.36, -1.15]), _l = _k.next(); !_l.done; _l = _k.next()) {
                        var x = _l.value;
                        mesh(cafe, cupBody, 15193268, x, 1.25, 1.25, false);
                        tube2(cafe, [x + 0.04, 1.26, 1.25], [x + 0.075, 1.26, 1.25], 0.012, 15193268, 6);
                    }
                }
                catch (e_124_1) { e_124 = { error: e_124_1 }; }
                finally {
                    try {
                        if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                    }
                    finally { if (e_124) throw e_124.error; }
                }
                var caseTop = new THREE.Mesh(new THREE.BoxGeometry(0.73, 0.3, 0.47), glassCase);
                caseTop.position.set(-1.34, 1.67, 1.25);
                caseTop.castShadow = false;
                cafe.add(caseTop);
                box2(cafe, -1.34, 1.51, 1.25, 0.7, 0.035, 0.45, darkWood, false);
                try {
                    for (var _m = __values([-1.55, -1.34, -1.13]), _o = _m.next(); !_o.done; _o = _m.next()) {
                        var x = _o.value;
                        mesh(cafe, new THREE.SphereGeometry(0.065, 10, 8), 15123852, x, 1.57, 1.25, false);
                    }
                }
                catch (e_125_1) { e_125 = { error: e_125_1 }; }
                finally {
                    try {
                        if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
                    }
                    finally { if (e_125) throw e_125.error; }
                }
                try {
                    for (var _p = __values([1.18, 1.58, 1.94]), _q = _p.next(); !_q.done; _q = _p.next()) {
                        var y = _q.value;
                        box2(cafe, -0.88, y, -1.79, 2.25, 0.055, 0.18, darkWood, false);
                        for (var i = 0; i < 8; i++) {
                            var jarX = -1.82 + i * 0.27;
                            var jarY = y + 0.1 + i % 3 * 0.025;
                            mesh(cafe, new THREE.CylinderGeometry(0.045, 0.05, 0.2 + i % 2 * 0.05, 8), [13015653, 10118473, 13939069][i % 3], jarX, jarY, -1.72, false);
                        }
                    }
                }
                catch (e_126_1) { e_126 = { error: e_126_1 }; }
                finally {
                    try {
                        if (_q && !_q.done && (_f = _p.return)) _f.call(_p);
                    }
                    finally { if (e_126) throw e_126.error; }
                }
                function tableAndChairs(x, z, y, count, rotation) {
                    var e_130, _d, e_131, _e, e_132, _f, e_133, _g;
                    if (count === void 0) { count = 2; }
                    if (rotation === void 0) { rotation = 0; }
                    var floorY = y < 2 ? 0.41 : 2.6;
                    mesh(cafe, tableTop2, 9792076, x, y, z, false);
                    lightPaint2.add(cafe, [x - 0.065, y + 0.042, z], [0.51, 0.52], y < 2 ? "#ffc390" : "#ffdbb2", 0.49, true);
                    tube2(cafe, [x, y - 0.04, z], [x, floorY + 0.04, z], 0.043, darkWood, 8);
                    try {
                        for (var _h = __values([0, Math.PI / 2, Math.PI, Math.PI * 1.5]), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var angle = _j.value;
                            tube2(cafe, [x, floorY + 0.08, z], [
                                x + Math.cos(angle) * 0.22,
                                floorY + 0.025,
                                z + Math.sin(angle) * 0.22
                            ], 0.022, darkWood, 6);
                        }
                    }
                    catch (e_130_1) { e_130 = { error: e_130_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                        }
                        finally { if (e_130) throw e_130.error; }
                    }
                    mesh(cafe, cupBody, 15259319, x - 0.1, y + 0.055, z - 0.04, false);
                    mesh(cafe, new THREE.CylinderGeometry(0.023, 0.023, 8e-3, 12), 7358770, x - 0.1, y + 0.096, z - 0.04, false);
                    var angles = count === 1 ? [rotation] : [rotation, rotation + Math.PI];
                    try {
                        for (var angles_1 = __values(angles), angles_1_1 = angles_1.next(); !angles_1_1.done; angles_1_1 = angles_1.next()) {
                            var angle = angles_1_1.value;
                            var chairX = x + Math.cos(angle) * 0.55;
                            var chairZ = z + Math.sin(angle) * 0.55;
                            var seatY = floorY + 0.48;
                            box2(cafe, chairX, seatY, chairZ, 0.43, 0.1, 0.4, upholstery, false);
                            var back2 = mesh(cafe, unitBox, darkWood, chairX + Math.cos(angle) * 0.17, seatY + 0.22, chairZ + Math.sin(angle) * 0.17, false);
                            back2.scale.set(0.42, 0.43, 0.09);
                            back2.rotation.y = angle - Math.PI / 2;
                            try {
                                for (var _k = (e_132 = void 0, __values([-0.15, 0.15])), _l = _k.next(); !_l.done; _l = _k.next()) {
                                    var dx = _l.value;
                                    try {
                                        for (var _m = (e_133 = void 0, __values([-0.13, 0.13])), _o = _m.next(); !_o.done; _o = _m.next()) {
                                            var dz = _o.value;
                                            box2(cafe, chairX + dx, (floorY + seatY) / 2, chairZ + dz, 0.035, seatY - floorY, 0.035, darkWood, false);
                                        }
                                    }
                                    catch (e_133_1) { e_133 = { error: e_133_1 }; }
                                    finally {
                                        try {
                                            if (_o && !_o.done && (_g = _m.return)) _g.call(_m);
                                        }
                                        finally { if (e_133) throw e_133.error; }
                                    }
                                }
                            }
                            catch (e_132_1) { e_132 = { error: e_132_1 }; }
                            finally {
                                try {
                                    if (_l && !_l.done && (_f = _k.return)) _f.call(_k);
                                }
                                finally { if (e_132) throw e_132.error; }
                            }
                        }
                    }
                    catch (e_131_1) { e_131 = { error: e_131_1 }; }
                    finally {
                        try {
                            if (angles_1_1 && !angles_1_1.done && (_e = angles_1.return)) _e.call(angles_1);
                        }
                        finally { if (e_131) throw e_131.error; }
                    }
                }
                tableAndChairs(1.27, -0.79, 0.98, 2, Math.PI / 2);
                tableAndChairs(0.86, 0.35, 0.98, 1, Math.PI);
                box2(cafe, -0.46, 0.416, -1.1, 0.78, 0.012, 1.12, 7754564, false);
                box2(cafe, 0.66, 0.72, -1.62, 0.92, 0.54, 0.36, darkWood, false);
                box2(cafe, 0.66, 1.01, -1.62, 1, 0.07, 0.42, 10910808, false);
                box2(cafe, -0.92, 0.57, -1.76, 0.08, 0.36, 0.08, darkWood, false);
                box2(cafe, -0.92, 0.8, -1.76, 0.3, 0.07, 0.22, 9792076, false);
                mesh(cafe, new THREE.CylinderGeometry(0.11, 0.13, 0.24, 10), 10115398, -0.92, 0.35, -1.76, false);
                try {
                    for (var _r = __values([[-0.99, 0.69, -1.78], [-0.86, 0.71, -1.75], [-0.94, 0.79, -1.7]]), _s = _r.next(); !_s.done; _s = _r.next()) {
                        var leaf = _s.value;
                        mesh(cafe, new THREE.IcosahedronGeometry(0.12, 0), 7439194, leaf[0], leaf[1], leaf[2], false);
                    }
                }
                catch (e_127_1) { e_127 = { error: e_127_1 }; }
                finally {
                    try {
                        if (_s && !_s.done && (_g = _r.return)) _g.call(_r);
                    }
                    finally { if (e_127) throw e_127.error; }
                }
                tableAndChairs(-1.12, 1.02, 3.3, 2, Math.PI / 2);
                box2(cafe, 1.54, 3.02, -0.34, 0.65, 0.6, 1.54, upholstery, false);
                box2(cafe, 1.54, 3.34, -0.34, 0.68, 0.12, 1.6, 10253915, false);
                box2(cafe, 0.98, 3.01, -0.34, 0.12, 0.78, 1.58, 6899770, false);
                mesh(cafe, new THREE.CylinderGeometry(0.34, 0.34, 0.075, 16), 9792076, 0.68, 3.29, -0.36, false);
                tube2(cafe, [0.68, 3.25, -0.36], [0.68, 2.78, -0.36], 0.04, darkWood, 8);
                try {
                    for (var _t = __values([0.49, 0.87]), _u = _t.next(); !_u.done; _u = _t.next()) {
                        var x = _u.value;
                        box2(cafe, x, 2.9, 0.22, 0.38, 0.1, 0.38, upholstery, false);
                        box2(cafe, x, 3.12, 0.38, 0.38, 0.4, 0.09, darkWood, false);
                    }
                }
                catch (e_128_1) { e_128 = { error: e_128_1 }; }
                finally {
                    try {
                        if (_u && !_u.done && (_h = _t.return)) _h.call(_t);
                    }
                    finally { if (e_128) throw e_128.error; }
                }
                tableAndChairs(0.05, -0.86, 3.28, 2, Math.PI / 2);
                box2(cafe, -0.08, 3.07, -1.8, 0.88, 0.82, 0.24, 6899770, false);
                box2(cafe, -0.08, 3.49, -1.65, 0.94, 0.055, 0.32, 10582616, false);
                try {
                    for (var _v = __values([2.88, 3.13, 3.38]), _w = _v.next(); !_w.done; _w = _v.next()) {
                        var y = _w.value;
                        box2(cafe, -0.08, y, -1.64, 0.84, 0.035, 0.27, 10451287, false);
                        for (var i = 0; i < 5; i++) {
                            var bookHeight = 0.12 + i % 3 * 0.035;
                            box2(cafe, -0.39 + i * 0.15, y + 0.035 + bookHeight / 2, -1.64, 0.1, bookHeight, 0.2, [8147266, 10186829, 6846059][i % 3], false);
                        }
                    }
                }
                catch (e_129_1) { e_129 = { error: e_129_1 }; }
                finally {
                    try {
                        if (_w && !_w.done && (_j = _v.return)) _j.call(_v);
                    }
                    finally { if (e_129) throw e_129.error; }
                }
                tableAndChairs(1.2, 1.02, 3.28, 2, Math.PI / 2);
                box2(cafe, -1.74, 2.98, 1.22, 0.72, 0.54, 1.32, upholstery, false);
                box2(cafe, -1.74, 3.27, 1.22, 0.76, 0.1, 1.38, 10582616, false);
                box2(cafe, -1.74, 3.2, 0.56, 0.76, 0.58, 0.12, darkWood, false);
                box2(cafe, -1.16, 3.12, 1.17, 0.32, 0.12, 0.32, 9792076, false);
                tube2(cafe, [-1.16, 3.06, 1.17], [-1.16, 2.65, 1.17], 0.032, darkWood, 8);
                box2(cafe, -1.74, 2.608, 1.22, 1.15, 0.012, 1.58, 7692365, false);
                function pendant(x, ceilingY, shadeY, z) {
                    tube2(cafe, [x, ceilingY, z], [x, shadeY + 0.09, z], 0.012, 4995377, 6);
                    mesh(cafe, new THREE.ConeGeometry(0.13, 0.1, 10), 5784378, x, shadeY, z, false).rotation.x = Math.PI;
                    mesh(cafe, new THREE.SphereGeometry(0.045, 10, 8), warmBulb, x, shadeY - 0.065, z, false);
                    var downstairs = shadeY < 3;
                    var light = new THREE.PointLight(downstairs ? "#ffba79" : "#ffd0a1", downstairs ? 1.4 : 1.13, 2.55, 2);
                    light.position.set(x, shadeY - 0.06, z);
                    cafe.add(light);
                    lightPaint2.add(cafe, [x, downstairs ? 0.416 : 2.606, z], [1.24, 1.05], downstairs ? "#ffc187" : "#ffd5a6", 0.4, true);
                }
                pendant(-0.25, 2.43, 2.05, 0.1);
                pendant(1.24, 2.43, 2.04, -0.92);
                pendant(-0.6, 4.76, 4.3, 0.3);
                pendant(1, 4.76, 4.28, -0.9);
            }
            try {
                for (var _6 = __values([
                    [front, width, frontOpenings],
                    [east, depth, eastOpenings],
                    [back, width, backOpenings],
                    [west, depth, westOpenings]
                ]), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                    var _8 = __read(_7.value, 3), face = _8[0], faceWidth = _8[1], openings = _8[2];
                    try {
                        for (var _9 = (e_97 = void 0, __values([-faceWidth / 2 + 0.12, faceWidth / 2 - 0.12])), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                            var x = _10.value;
                            box2(face, x, 1.25, 0.022, 0.114, 2.19, 0.072, wood);
                            box2(face, x, 3.67, 0.018, 0.101, 2.23, 0.056, amberWood);
                        }
                    }
                    catch (e_97_1) { e_97 = { error: e_97_1 }; }
                    finally {
                        try {
                            if (_10 && !_10.done && (_f = _9.return)) _f.call(_9);
                        }
                        finally { if (e_97) throw e_97.error; }
                    }
                    var _loop_11 = function (y) {
                        var e_134, _49;
                        var right = faceWidth / 2 - 0.18;
                        var left = -right;
                        var gaps = openings.filter(function (hole) { return y + 6e-3 > hole.y0 && y - 6e-3 < hole.y1; }).sort(function (a, b) { return a.x0 - b.x0; });
                        try {
                            for (var gaps_2 = (e_134 = void 0, __values(gaps)), gaps_2_1 = gaps_2.next(); !gaps_2_1.done; gaps_2_1 = gaps_2.next()) {
                                var gap = gaps_2_1.value;
                                if (gap.x0 > left) {
                                    box2(face, (left + gap.x0) / 2, y, 2e-3, gap.x0 - left, 9e-3, 0.014, 13017988, false);
                                }
                                left = Math.max(left, gap.x1);
                            }
                        }
                        catch (e_134_1) { e_134 = { error: e_134_1 }; }
                        finally {
                            try {
                                if (gaps_2_1 && !gaps_2_1.done && (_49 = gaps_2.return)) _49.call(gaps_2);
                            }
                            finally { if (e_134) throw e_134.error; }
                        }
                        if (right > left)
                            box2(face, (left + right) / 2, y, 2e-3, right - left, 9e-3, 0.014, 13017988, false);
                    };
                    for (var y = 2.77; y < 4.73; y += 0.18) {
                        _loop_11(y);
                    }
                }
            }
            catch (e_96_1) { e_96 = { error: e_96_1 }; }
            finally {
                try {
                    if (_7 && !_7.done && (_e = _6.return)) _e.call(_6);
                }
                finally { if (e_96) throw e_96.error; }
            }
            windowUnit(front, -0.9, 1.18, 2.15, 1.3, { transom: true, light: 0.69 });
            windowUnit(front, -1.15, 3.67, 1.22, 1.34, { transom: true });
            entrance(front, 0.88, upperFloor, 1.43, 1.93, 0.38, true);
            windowUnit(east, -0.78, 1.23, 1.48, 1.32, { transom: true, light: 0.82 });
            windowUnit(east, 0.99, 1.34, 1.17, 0.93, { light: 0.54 });
            windowUnit(east, -0.88, 3.71, 1.29, 1.26, { transom: true, light: 0.39 });
            windowUnit(east, 0.87, 3.71, 1.24, 1.26, { transom: true, light: 0.25 });
            windowUnit(west, 0.58, 3.69, 1.42, 1.23, { transom: true, light: 0.26 });
            windowUnit(back, -0.91, 3.69, 1.19, 1.15, { transom: true, light: 0.28 });
            windowUnit(back, 0.8, 3.69, 1.04, 1.15, { transom: true, light: 0.2 });
            entrance(front, 1.07, groundFloor, 0.99, 1.89, 0.72);
            entrySteps(front, 1.07, 1.11);
            try {
                for (var _11 = __values([-1.78, -0.96, -0.14]), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                    var x = _12.value;
                    box2(front, x, 0.36, 0.038, 0.76, 0.34, 0.09, amberWood);
                    box2(front, x, 0.36, 0.09, 0.63, 0.24, 0.025, 10314822);
                }
            }
            catch (e_98_1) { e_98 = { error: e_98_1 }; }
            finally {
                try {
                    if (_12 && !_12.done && (_g = _11.return)) _g.call(_11);
                }
                finally { if (e_98) throw e_98.error; }
            }
            box2(east, -0.75, 0.37, 0.036, 1.59, 0.32, 0.09, amberWood);
            box2(east, -0.75, 0.37, 0.09, 1.43, 0.22, 0.025, 10314822);
            box2(front, -0.9, 2.3, 0.082, 2.46, 0.42, 0.21, wood);
            panel(front, -0.9, 2.3, 0.194, 2.32, 0.38, storefrontSign, 0.39);
            box2(east, -0.33, 2.28, 0.071, 2.91, 0.52, 0.21, wood);
            panel(east, -0.33, 2.28, 0.181, 2.8, 0.49, storefrontSign, 0.34);
            box2(east, -1.77, 3.09, 0.28, 0.063, 1.08, 0.38, wood);
            box2(east, -1.77, 3.52, 0.12, 0.07, 0.055, 0.3, blackMetal);
            box2(east, -1.77, 2.68, 0.12, 0.07, 0.055, 0.3, blackMetal);
            try {
                for (var _13 = __values([-1, 1]), _14 = _13.next(); !_14.done; _14 = _13.next()) {
                    var side = _14.value;
                    var signFace = panel(east, -1.77 + side * 0.034, 3.09, 0.295, 0.335, 1, lightboxSign, 1.23);
                    signFace.rotation.y = side * Math.PI / 2;
                }
            }
            catch (e_99_1) { e_99 = { error: e_99_1 }; }
            finally {
                try {
                    if (_14 && !_14.done && (_h = _13.return)) _h.call(_13);
                }
                finally { if (e_99) throw e_99.error; }
            }
            function awning(face, x, y, span, reach) {
                var e_135, _d;
                var vertices = [];
                var colors = [];
                var stripeCount = 12;
                var segments = 8;
                var edge = function (ratio) { return 0.29 * ratio + 0.17 * ratio * ratio; };
                var append = function (positions, hex) {
                    var e_136, _d;
                    var color = new THREE.Color(hex);
                    try {
                        for (var positions_1 = __values(positions), positions_1_1 = positions_1.next(); !positions_1_1.done; positions_1_1 = positions_1.next()) {
                            var position = positions_1_1.value;
                            vertices.push.apply(vertices, __spreadArray([], __read(position), false));
                            colors.push(color.r, color.g, color.b);
                        }
                    }
                    catch (e_136_1) { e_136 = { error: e_136_1 }; }
                    finally {
                        try {
                            if (positions_1_1 && !positions_1_1.done && (_d = positions_1.return)) _d.call(positions_1);
                        }
                        finally { if (e_136) throw e_136.error; }
                    }
                };
                for (var column = 0; column < stripeCount; column++) {
                    var left = x - span / 2 + column * span / stripeCount;
                    var right = left + span / stripeCount;
                    var hex = column % 2 ? awningRed : awningLight;
                    for (var row = 0; row < segments; row++) {
                        var a = row / segments;
                        var b = (row + 1) / segments;
                        var p0 = [left, y - edge(a), 0.094 + reach * a];
                        var p1 = [right, y - edge(a), 0.094 + reach * a];
                        var p2 = [right, y - edge(b), 0.094 + reach * b];
                        var p3 = [left, y - edge(b), 0.094 + reach * b];
                        append([p0, p2, p1, p0, p3, p2], hex);
                    }
                    var z = 0.098 + reach;
                    var top = y - edge(1);
                    var middle = (left + right) / 2;
                    append([
                        [left, top, z],
                        [left, top - 0.16, z],
                        [middle, top - 0.21, z],
                        [left, top, z],
                        [middle, top - 0.21, z],
                        [right, top, z],
                        [middle, top - 0.21, z],
                        [right, top - 0.16, z],
                        [right, top, z]
                    ], hex);
                }
                var shape = new THREE.BufferGeometry();
                shape.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
                shape.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
                shape.computeVertexNormals();
                mesh(face, shape, new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.93,
                    side: THREE.DoubleSide
                }), 0, 0, 0);
                tube2(face, [x - span / 2, y - 0.46, 0.094 + reach], [x + span / 2, y - 0.46, 0.094 + reach], 0.023, wood);
                try {
                    for (var _e = __values([-1, 1]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var side = _f.value;
                        var joint = x + side * (span / 2 - 0.1);
                        tube2(face, [joint, y - 0.5, 0.08], [joint, y - 0.46, 0.094 + reach], 0.016, blackMetal);
                        tube2(face, [joint, y - 0.76, 0.08], [joint, y - 0.46, 0.094 + reach], 0.014, blackMetal);
                    }
                }
                catch (e_135_1) { e_135 = { error: e_135_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_135) throw e_135.error; }
                }
            }
            awning(front, -0.9, 2.15, 2.49, 0.67);
            awning(east, -0.68, 2.1, 2.37, 0.49);
            function balcony(face, center, y, span, reach) {
                var e_137, _d, e_138, _e, e_139, _f;
                box2(face, center, y, reach * 0.49, span + 0.16, 0.13, reach + 0.12, wood);
                box2(face, center, y + 0.077, reach * 0.49, span + 0.12, 0.026, reach + 0.08, amberWood);
                try {
                    for (var _g = __values([y + 0.28, y + 0.74]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var railY = _h.value;
                        var thickness = railY > y + 0.5 ? 0.035 : 0.023;
                        tube2(face, [center - span / 2, railY, reach], [center + span / 2, railY, reach], thickness, railMetal);
                        try {
                            for (var _j = (e_138 = void 0, __values([center - span / 2, center + span / 2])), _k = _j.next(); !_k.done; _k = _j.next()) {
                                var x = _k.value;
                                tube2(face, [x, railY, reach], [x, railY, 0.085], thickness, railMetal);
                            }
                        }
                        catch (e_138_1) { e_138 = { error: e_138_1 }; }
                        finally {
                            try {
                                if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                            }
                            finally { if (e_138) throw e_138.error; }
                        }
                    }
                }
                catch (e_137_1) { e_137 = { error: e_137_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_137) throw e_137.error; }
                }
                for (var i = 0; i <= 12; i++) {
                    var x = center - span / 2 + i * span / 12;
                    tube2(face, [x, y + 0.1, reach], [x, y + 0.75, reach], i % 6 === 0 ? 0.028 : 0.016, railMetal);
                }
                try {
                    for (var _l = __values([center - span / 2, center + span / 2]), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var x = _m.value;
                        tube2(face, [x, y - 0.29, 0.055], [x, y - 0.06, reach], 0.022, railMetal);
                    }
                }
                catch (e_139_1) { e_139 = { error: e_139_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                    }
                    finally { if (e_139) throw e_139.error; }
                }
            }
            balcony(front, 0.88, upperFloor - 0.09, 2.11, 0.66);
            var windowBoxFloor = 2.86;
            box2(east, 0.8, windowBoxFloor, 0.18, 1.61, 0.09, 0.3, teal);
            try {
                for (var _15 = __values([0.12, 0.52, 0.92, 1.32, 1.55]), _16 = _15.next(); !_16.done; _16 = _15.next()) {
                    var x = _16.value;
                    tube2(east, [x, windowBoxFloor, 0.33], [x, windowBoxFloor + 0.4, 0.33], 0.016, railMetal);
                }
            }
            catch (e_100_1) { e_100 = { error: e_100_1 }; }
            finally {
                try {
                    if (_16 && !_16.done && (_j = _15.return)) _j.call(_15);
                }
                finally { if (e_100) throw e_100.error; }
            }
            tube2(east, [0.12, windowBoxFloor + 0.4, 0.33], [1.55, windowBoxFloor + 0.4, 0.33], 0.023, railMetal);
            tube2(east, [0.12, windowBoxFloor + 0.16, 0.33], [1.55, windowBoxFloor + 0.16, 0.33], 0.018, railMetal);
            var roofEaves = { x: 2.59, z: 2.33, y: 4.99 };
            var ridgeX = 0.63;
            var ridgeY = 6.02;
            var flanks = [
                [
                    [-roofEaves.x, roofEaves.y, roofEaves.z],
                    [roofEaves.x, roofEaves.y, roofEaves.z],
                    [-ridgeX, ridgeY, 0],
                    [ridgeX, ridgeY, 0]
                ],
                [
                    [roofEaves.x, roofEaves.y, -roofEaves.z],
                    [-roofEaves.x, roofEaves.y, -roofEaves.z],
                    [ridgeX, ridgeY, 0],
                    [-ridgeX, ridgeY, 0]
                ],
                [
                    [roofEaves.x, roofEaves.y, roofEaves.z],
                    [roofEaves.x, roofEaves.y, -roofEaves.z],
                    [ridgeX, ridgeY, 0],
                    [ridgeX, ridgeY, 0]
                ],
                [
                    [-roofEaves.x, roofEaves.y, -roofEaves.z],
                    [-roofEaves.x, roofEaves.y, roofEaves.z],
                    [-ridgeX, ridgeY, 0],
                    [-ridgeX, ridgeY, 0]
                ]
            ];
            var tileTransforms = [];
            try {
                for (var flanks_1 = __values(flanks), flanks_1_1 = flanks_1.next(); !flanks_1_1.done; flanks_1_1 = flanks_1.next()) {
                    var _17 = __read(flanks_1_1.value, 4), leftEave = _17[0], rightEave = _17[1], leftRidge = _17[2], rightRidge = _17[3];
                    var a = new ((_l = THREE.Vector3).bind.apply(_l, __spreadArray([void 0], __read(leftEave), false)))();
                    var b = new ((_m = THREE.Vector3).bind.apply(_m, __spreadArray([void 0], __read(rightEave), false)))();
                    var c = new ((_o = THREE.Vector3).bind.apply(_o, __spreadArray([void 0], __read(leftRidge), false)))();
                    var d = new ((_p = THREE.Vector3).bind.apply(_p, __spreadArray([void 0], __read(rightRidge), false)))();
                    var roofShape = new THREE.BufferGeometry();
                    roofShape.setAttribute("position", new THREE.Float32BufferAttribute(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(leftEave), false), __read(rightEave), false), __read(leftRidge), false), __read(rightEave), false), __read(rightRidge), false), __read(leftRidge), false), 3));
                    roofShape.computeVertexNormals();
                    mesh(cafe, roofShape, 5992560, 0, 0, 0);
                    var horizontal = b.clone().sub(a).normalize();
                    var slope = c.clone().add(d).sub(a).sub(b).multiplyScalar(0.5);
                    var tileLength = slope.length() / 12 + 0.025;
                    var upslope = slope.normalize();
                    var normal = new THREE.Vector3().crossVectors(horizontal, upslope).normalize();
                    var basis = new THREE.Matrix4().makeBasis(horizontal, normal, upslope.clone().negate());
                    var rotation = new THREE.Quaternion().setFromRotationMatrix(basis);
                    for (var row = 0; row < 12; row++) {
                        var t = (row + 0.53) / 12;
                        var l = a.clone().lerp(c, t);
                        var r = b.clone().lerp(d, t);
                        var count = Math.max(1, Math.round(l.distanceTo(r) / 0.25));
                        var tileWidth = l.distanceTo(r) / count;
                        for (var col = 0; col < count; col++) {
                            var position = l.clone().lerp(r, (col + 0.5) / count).addScaledVector(normal, 0.035 + row * 3e-3);
                            tileTransforms.push({ position: position, rotation: rotation, tileWidth: tileWidth, tileLength: tileLength, row: row, col: col });
                        }
                    }
                    tube2(cafe, leftEave, rightEave, 0.047, roofTrim);
                    var hipEave = [leftEave[0], leftEave[1] + 0.06, leftEave[2]];
                    var hipRidge = [leftRidge[0], leftRidge[1] + 0.091, leftRidge[2]];
                    tube2(cafe, hipEave, hipRidge, 0.058, roofTrim);
                }
            }
            catch (e_101_1) { e_101 = { error: e_101_1 }; }
            finally {
                try {
                    if (flanks_1_1 && !flanks_1_1.done && (_k = flanks_1.return)) _k.call(flanks_1);
                }
                finally { if (e_101) throw e_101.error; }
            }
            var tile = new THREE.InstancedMesh(unitBox, new THREE.MeshStandardMaterial({ color: 16777215, roughness: 0.9 }), tileTransforms.length);
            var transform = new THREE.Matrix4();
            var tilePalette = [5926512, 6255218, 6583926, 5663598, 6846841];
            try {
                for (var _18 = __values(tileTransforms.entries()), _19 = _18.next(); !_19.done; _19 = _18.next()) {
                    var _20 = __read(_19.value, 2), index = _20[0], data = _20[1];
                    var position = data.position, rotation = data.rotation, tileWidth = data.tileWidth, tileLength = data.tileLength, row = data.row, col = data.col;
                    transform.compose(position, rotation, new THREE.Vector3(tileWidth - 9e-3, 0.052, tileLength));
                    tile.setMatrixAt(index, transform);
                    tile.setColorAt(index, new THREE.Color(tilePalette[(row * 7 + col * 3 + row * col) % tilePalette.length]));
                }
            }
            catch (e_102_1) { e_102 = { error: e_102_1 }; }
            finally {
                try {
                    if (_19 && !_19.done && (_q = _18.return)) _q.call(_18);
                }
                finally { if (e_102) throw e_102.error; }
            }
            tile.castShadow = true;
            tile.receiveShadow = true;
            cafe.add(tile);
            tube2(cafe, [-ridgeX - 0.03, ridgeY + 0.065, 0], [ridgeX + 0.03, ridgeY + 0.065, 0], 0.084, roofTrim);
            try {
                for (var _21 = __values([-ridgeX - 0.035, ridgeX + 0.035]), _22 = _21.next(); !_22.done; _22 = _21.next()) {
                    var x = _22.value;
                    var cap = mesh(cafe, new THREE.SphereGeometry(0.095, 12, 8), roofTrim, x, ridgeY + 0.074, 0);
                    cap.scale.set(0.57, 1, 1);
                }
            }
            catch (e_103_1) { e_103 = { error: e_103_1 }; }
            finally {
                try {
                    if (_22 && !_22.done && (_r = _21.return)) _r.call(_21);
                }
                finally { if (e_103) throw e_103.error; }
            }
            box2(cafe, -0.76, 5.57, -0.92, 0.43, 0.66, 0.38, 9597537);
            box2(cafe, -0.76, 5.9, -0.92, 0.51, 0.075, 0.46, 5392968);
            box2(cafe, -0.76, 6.01, -0.92, 0.39, 0.06, 0.36, 6840924);
            try {
                for (var _23 = __values([-0.89, -0.63]), _24 = _23.next(); !_24.done; _24 = _23.next()) {
                    var x = _24.value;
                    try {
                        for (var _25 = (e_105 = void 0, __values([-1.02, -0.82])), _26 = _25.next(); !_26.done; _26 = _25.next()) {
                            var z = _26.value;
                            box2(cafe, x, 5.965, z, 0.037, 0.06, 0.034, 6705747);
                        }
                    }
                    catch (e_105_1) { e_105 = { error: e_105_1 }; }
                    finally {
                        try {
                            if (_26 && !_26.done && (_t = _25.return)) _t.call(_25);
                        }
                        finally { if (e_105) throw e_105.error; }
                    }
                }
            }
            catch (e_104_1) { e_104 = { error: e_104_1 }; }
            finally {
                try {
                    if (_24 && !_24.done && (_s = _23.return)) _s.call(_23);
                }
                finally { if (e_104) throw e_104.error; }
            }
            tube2(cafe, [1.01, 5.72, -0.7], [1.01, 6.36, -0.7], 0.018, 6510935);
            try {
                for (var _27 = __values([6.16, 6.25, 6.34]), _28 = _27.next(); !_28.done; _28 = _27.next()) {
                    var y = _28.value;
                    tube2(cafe, [0.8, y, -0.62], [1.24, y, -0.78], 0.012, 6510935);
                }
            }
            catch (e_106_1) { e_106 = { error: e_106_1 }; }
            finally {
                try {
                    if (_28 && !_28.done && (_u = _27.return)) _u.call(_27);
                }
                finally { if (e_106) throw e_106.error; }
            }
            var terra = 10050381;
            var foliage = [7374170, 8885341, 5270864, 10328933, 6649941];
            var leafShape = new THREE.IcosahedronGeometry(0.1, 0);
            function plant(face, x, y, z, size, ceramic) {
                if (ceramic === void 0) { ceramic = terra; }
                mesh(face, new THREE.CylinderGeometry(0.15 * size, 0.112 * size, 0.24 * size, 12), ceramic, x, y + 0.12 * size, z);
                mesh(face, new THREE.CylinderGeometry(0.167 * size, 0.164 * size, 0.043 * size, 12), ceramic, x, y + 0.225 * size, z);
                mesh(face, new THREE.CircleGeometry(0.139 * size, 12), 5390649, x, y + 0.249 * size, z, false).rotation.x = -Math.PI / 2;
                for (var i = 0; i < 12; i++) {
                    var angle = i * 2.4;
                    var reach = (0.06 + i % 5 * 0.028) * size;
                    var dx = Math.cos(angle) * reach;
                    var dz = Math.sin(angle) * reach;
                    var ly = y + (0.31 + i * 7 % 12 * 0.031) * size;
                    var rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(angle * 0.29, angle, -0.7));
                    staticPart(face, leafShape, foliage[i * 3 % 5], new THREE.Vector3(x + dx, ly, z + dz), rotation, new THREE.Vector3(size * 0.8, size * 1.45, size * 0.49), false);
                }
            }
            plant(front, -1.91, 0, 0.77, 1.18);
            plant(front, -1.62, 0, 0.68, 0.78, 8816237);
            plant(front, 1.87, 0, 0.46, 0.88);
            plant(front, 0.01, upperFloor, 0.42, 0.62);
            plant(front, 1.75, upperFloor, 0.44, 0.68, 10976342);
            plant(east, 0.81, windowBoxFloor + 0.045, 0.18, 0.64, 9269335);
            plant(east, 1.59, 0, 0.46, 1.22, 7436902);
            var menuStand = new THREE.Group();
            menuStand.position.set(-0.12, 0.02, 0.87);
            menuStand.rotation.y = -0.13;
            front.add(menuStand);
            try {
                for (var _29 = __values([-1, 1]), _30 = _29.next(); !_30.done; _30 = _29.next()) {
                    var side = _30.value;
                    tube2(menuStand, [side * 0.25, 0, 0.12], [side * 0.25, 0.67, -0.01], 0.028, amberWood, 6);
                    tube2(menuStand, [side * 0.25, 0, -0.25], [side * 0.25, 0.67, -0.01], 0.028, amberWood, 6);
                }
            }
            catch (e_107_1) { e_107 = { error: e_107_1 }; }
            finally {
                try {
                    if (_30 && !_30.done && (_v = _29.return)) _v.call(_29);
                }
                finally { if (e_107) throw e_107.error; }
            }
            box2(menuStand, 0, 0.4, 0.062, 0.51, 0.53, 0.036, amberWood);
            panel(menuStand, 0, 0.4, 0.083, 0.455, 0.485, menu, 0.16);
            var lampGlow = new THREE.MeshStandardMaterial({
                color: 16760688,
                emissive: 16751438,
                emissiveIntensity: 1.18,
                roughness: 0.48
            });
            function sconce(face, x, y) {
                box2(face, x, y, 0.057, 0.105, 0.16, 0.08, wood);
                tube2(face, [x, y + 0.11, 0.08], [x, y + 0.11, 0.19], 0.021, blackMetal);
                mesh(face, new THREE.ConeGeometry(0.115, 0.07, 8), blackMetal, x, y + 0.056, 0.19);
                mesh(face, new THREE.CylinderGeometry(0.077, 0.065, 0.12, 8), lampGlow, x, y - 0.035, 0.19, false);
                mesh(face, new THREE.CylinderGeometry(0.081, 0.081, 0.025, 8), blackMetal, x, y - 0.106, 0.19);
                lightPaint2.add(face, [x, y - 0.18, 0.037], [0.69, 1.1], "#ffc085", 0.44);
                lightPaint2.add(face, [x, 3e-3, 0.52], [0.88, 0.98], "#ffb97b", 0.25, true);
            }
            sconce(front, 1.84, 1.87);
            sconce(east, -1.57, 1.91);
            var gutterColor = 7567221;
            var gutterX = roofEaves.x + 0.035;
            var gutterZ = roofEaves.z + 0.035;
            try {
                for (var _31 = __values([[gutterZ, 4.959], [-gutterZ, 4.935]]), _32 = _31.next(); !_32.done; _32 = _31.next()) {
                    var _33 = __read(_32.value, 2), z = _33[0], y = _33[1];
                    tube2(cafe, [-gutterX, y, z], [0, y + 0.025, z], 0.037, gutterColor);
                    tube2(cafe, [0, y + 0.025, z], [gutterX, y, z], 0.037, gutterColor);
                }
            }
            catch (e_108_1) { e_108 = { error: e_108_1 }; }
            finally {
                try {
                    if (_32 && !_32.done && (_w = _31.return)) _w.call(_31);
                }
                finally { if (e_108) throw e_108.error; }
            }
            var gutterReach = gutterX - width / 2;
            try {
                for (var _34 = __values([[east, 1.87], [west, -1.87]]), _35 = _34.next(); !_35.done; _35 = _34.next()) {
                    var _36 = __read(_35.value, 2), face = _36[0], x = _36[1];
                    var high = -Math.sign(x) * gutterZ;
                    var low = Math.sign(x) * gutterZ;
                    tube2(face, [high, 4.959, gutterReach], [x, 4.928, gutterReach], 0.037, gutterColor);
                    tube2(face, [x, 4.928, gutterReach], [low, 4.935, gutterReach], 0.037, gutterColor);
                    tube2(face, [x, 4.928, gutterReach], [x, 4.76, 0.105], 0.038, 7431263);
                    tube2(face, [x, 4.76, 0.105], [x, 0.16, 0.105], 0.038, 7431263);
                    tube2(face, [x, 0.16, 0.105], [x, 0.05, 0.21], 0.038, 7431263);
                    box2(face, x, 8e-3, 0.22, 0.2, 0.016, 0.17, blackMetal, false);
                    try {
                        for (var _37 = (e_110 = void 0, __values([-0.065, -0.032, 0, 0.032, 0.065])), _38 = _37.next(); !_38.done; _38 = _37.next()) {
                            var shift = _38.value;
                            box2(face, x + shift, 0.015, 0.22, 0.013, 9e-3, 0.14, 7431263, false);
                        }
                    }
                    catch (e_110_1) { e_110 = { error: e_110_1 }; }
                    finally {
                        try {
                            if (_38 && !_38.done && (_y = _37.return)) _y.call(_37);
                        }
                        finally { if (e_110) throw e_110.error; }
                    }
                    try {
                        for (var _39 = (e_111 = void 0, __values([0.71, 1.79, 2.74, 3.81, 4.5])), _40 = _39.next(); !_40.done; _40 = _39.next()) {
                            var y = _40.value;
                            box2(face, x, y, 0.1, 0.102, 0.041, 0.095, 6968914);
                        }
                    }
                    catch (e_111_1) { e_111 = { error: e_111_1 }; }
                    finally {
                        try {
                            if (_40 && !_40.done && (_z = _39.return)) _z.call(_39);
                        }
                        finally { if (e_111) throw e_111.error; }
                    }
                }
            }
            catch (e_109_1) { e_109 = { error: e_109_1 }; }
            finally {
                try {
                    if (_35 && !_35.done && (_x = _34.return)) _x.call(_34);
                }
                finally { if (e_109) throw e_109.error; }
            }
            function airConditioner(face, x, y) {
                var e_140, _d;
                var enamel = 12431264;
                box2(face, x, y, 0.17, 0.68, 0.45, 0.31, enamel);
                box2(face, x, y + 0.235, 0.17, 0.72, 0.04, 0.33, 14075052);
                mesh(face, new THREE.CircleGeometry(0.168, 18), 6708567, x - 0.08, y, 0.329, false);
                for (var i = -4; i <= 4; i++) {
                    box2(face, x - 0.08, y + i * 0.033, 0.337, 0.28 - 8e-3 * i * i, 0.019, 0.012, enamel, false);
                }
                box2(face, x + 0.212, y + 0.105, 0.332, 0.097, 0.04, 0.016, 10182742, false);
                try {
                    for (var _e = __values([-0.24, 0.24]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var dx = _f.value;
                        box2(face, x + dx, y - 0.239, 0.193, 0.064, 0.049, 0.39, blackMetal);
                        tube2(face, [x + dx, y - 0.245, 0.345], [x + dx, y - 0.46, 0.045], 0.019, blackMetal);
                    }
                }
                catch (e_140_1) { e_140 = { error: e_140_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_140) throw e_140.error; }
                }
                tube2(face, [x + 0.36, y - 0.13, 0.16], [x + 0.41, y - 0.28, 0.062], 0.027, 10326146);
                tube2(face, [x + 0.41, y - 0.28, 0.062], [x + 0.41, 0.13, 0.062], 0.018, 10326146);
                tube2(face, [x + 0.41, 0.13, 0.062], [x + 0.41, 0.043, 0.12], 0.018, 10326146);
                box2(face, x + 0.41, 7e-3, 0.12, 0.13, 0.014, 0.12, blackMetal, false);
            }
            airConditioner(back, 1.57, 0.66);
            entrance(back, 0.48, groundFloor, 0.86, 1.82, 0.23);
            entrySteps(back, 0.48, 0.94);
            interiorFurniture();
            var tableTop = mesh(east, new THREE.CylinderGeometry(0.25, 0.25, 0.047, 14), amberWood, -0.36, 0.52, 0.58);
            tableTop.rotation.y = 0.11;
            tube2(east, [-0.36, 0.09, 0.58], [-0.36, 0.51, 0.58], 0.05, blackMetal);
            try {
                for (var _41 = __values([0, 2.1, 4.2]), _42 = _41.next(); !_42.done; _42 = _41.next()) {
                    var angle = _42.value;
                    tube2(east, [-0.36, 0.13, 0.58], [-0.36 + Math.cos(angle) * 0.19, 0.027, 0.58 + Math.sin(angle) * 0.19], 0.022, blackMetal);
                }
            }
            catch (e_112_1) { e_112 = { error: e_112_1 }; }
            finally {
                try {
                    if (_42 && !_42.done && (_0 = _41.return)) _0.call(_41);
                }
                finally { if (e_112) throw e_112.error; }
            }
            mesh(east, new THREE.CylinderGeometry(0.062, 0.062, 0.013, 12), cream, -0.32, 0.55, 0.58);
            mesh(east, new THREE.CylinderGeometry(0.037, 0.029, 0.05, 12), cream, -0.32, 0.578, 0.58);
            mesh(east, new THREE.CircleGeometry(0.027, 12), 7358770, -0.32, 0.604, 0.58, false).rotation.x = -Math.PI / 2;
            try {
                for (var _43 = __values(batches.values()), _44 = _43.next(); !_44.done; _44 = _43.next()) {
                    var _45 = _44.value, host = _45.host, geometry = _45.geometry, material2 = _45.material, cast = _45.cast, transforms = _45.transforms;
                    var repeatedPart = new THREE.InstancedMesh(geometry, material2, transforms.length);
                    try {
                        for (var _46 = (e_114 = void 0, __values(transforms.entries())), _47 = _46.next(); !_47.done; _47 = _46.next()) {
                            var _48 = __read(_47.value, 2), index = _48[0], matrix2 = _48[1];
                            repeatedPart.setMatrixAt(index, matrix2);
                        }
                    }
                    catch (e_114_1) { e_114 = { error: e_114_1 }; }
                    finally {
                        try {
                            if (_47 && !_47.done && (_2 = _46.return)) _2.call(_46);
                        }
                        finally { if (e_114) throw e_114.error; }
                    }
                    repeatedPart.castShadow = cast && !host.userData.windowAndDoorTrim;
                    repeatedPart.receiveShadow = !host.userData.windowAndDoorTrim;
                    host.add(repeatedPart);
                }
            }
            catch (e_113_1) { e_113 = { error: e_113_1 }; }
            finally {
                try {
                    if (_44 && !_44.done && (_1 = _43.return)) _1.call(_43);
                }
                finally { if (e_113) throw e_113.error; }
            }
        }
        function buildFlorist(parent, lightPaint2) {
            var e_141, _d, e_142, _e, e_143, _f, e_144, _g, e_145, _h, e_146, _j, e_147, _k, e_148, _l, e_149, _m, e_150, _o, e_151, _p, e_152, _q, e_153, _r, e_154, _s, e_155, _t, e_156, _u, e_157, _v, e_158, _w, e_159, _x, e_160, _y, e_161, _z, e_162, _0, e_163, _1, e_164, _2, e_165, _3, e_166, _4;
            var shop = new THREE.Group();
            shop.name = "\u82B1\u65E5\u548C \xB7 Hanabiyori Florist";
            shop.position.set(-10.59, 0.18, 1.84);
            parent.add(shop);
            var random = randomFrom(11427);
            var wood = material("#947663");
            var darkWood = material("#785f53");
            var paleWood = material("#ad8a6c");
            var doorReveal = material("#473d38");
            var concrete = material("#8d8980");
            var darkMetal = material("#4d5755");
            var zinc = material("#87918c", { metalness: 0.29 });
            var awning = material("#527466", { side: THREE.DoubleSide });
            var awningEdge = material("#75917a", { side: THREE.DoubleSide });
            var tintable = material("#ffffff");
            var batches = new Map();
            var joineryBatches = new Map();
            var keyRotation = new THREE.Quaternion();
            function instance(geometry, finish, x, y, z, w, h, d, rotation, color, target) {
                if (rotation === void 0) { rotation = keyRotation; }
                if (target === void 0) { target = batches; }
                if (!target.has(geometry))
                    target.set(geometry, new Map());
                var byFinish = target.get(geometry);
                if (!byFinish.has(finish))
                    byFinish.set(finish, []);
                byFinish.get(finish).push({
                    matrix: new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), rotation, new THREE.Vector3(w, h, d)),
                    color: color
                });
            }
            function box2(finish, x, y, z, w, h, d, rotation) {
                instance(blockGeometry, finish, x, y, z, w, h, d, rotation);
            }
            function joineryBox(finish, x, y, z, w, h, d, rotation) {
                instance(blockGeometry, finish, x, y, z, w, h, d, rotation, void 0, joineryBatches);
            }
            var front = 1.93;
            var rear = -1.91;
            var width = 3.43;
            var wallX = width / 2;
            var span = front - rear;
            var wallTop = 3.78;
            var largeBeamY = 2.42;
            var shopFloor = 0.2;
            function wallPanels(finish, face, plane, u0, u1, y0, y1, openings, thickness) {
                var e_167, _d, e_168, _e, e_169, _f;
                if (thickness === void 0) { thickness = 0.1; }
                var regions = [[u0, y0, u1, y1]];
                try {
                    for (var openings_1 = __values(openings), openings_1_1 = openings_1.next(); !openings_1_1.done; openings_1_1 = openings_1.next()) {
                        var _g = __read(openings_1_1.value, 4), holeU0 = _g[0], holeY0 = _g[1], holeU1 = _g[2], holeY1 = _g[3];
                        var remaining = [];
                        try {
                            for (var regions_1 = (e_168 = void 0, __values(regions)), regions_1_1 = regions_1.next(); !regions_1_1.done; regions_1_1 = regions_1.next()) {
                                var _h = __read(regions_1_1.value, 4), a = _h[0], b = _h[1], c = _h[2], d = _h[3];
                                var left = Math.max(a, holeU0), bottom = Math.max(b, holeY0);
                                var right = Math.min(c, holeU1), top = Math.min(d, holeY1);
                                if (left >= right || bottom >= top) {
                                    remaining.push([a, b, c, d]);
                                    continue;
                                }
                                if (b < bottom)
                                    remaining.push([a, b, c, bottom]);
                                if (top < d)
                                    remaining.push([a, top, c, d]);
                                if (a < left)
                                    remaining.push([a, bottom, left, top]);
                                if (right < c)
                                    remaining.push([right, bottom, c, top]);
                            }
                        }
                        catch (e_168_1) { e_168 = { error: e_168_1 }; }
                        finally {
                            try {
                                if (regions_1_1 && !regions_1_1.done && (_e = regions_1.return)) _e.call(regions_1);
                            }
                            finally { if (e_168) throw e_168.error; }
                        }
                        regions = remaining;
                    }
                }
                catch (e_167_1) { e_167 = { error: e_167_1 }; }
                finally {
                    try {
                        if (openings_1_1 && !openings_1_1.done && (_d = openings_1.return)) _d.call(openings_1);
                    }
                    finally { if (e_167) throw e_167.error; }
                }
                try {
                    for (var regions_2 = __values(regions), regions_2_1 = regions_2.next(); !regions_2_1.done; regions_2_1 = regions_2.next()) {
                        var _j = __read(regions_2_1.value, 4), a = _j[0], b = _j[1], c = _j[2], d = _j[3];
                        var u = (a + c) / 2, y = (b + d) / 2;
                        if (face === "side")
                            box2(finish, plane, y, u, thickness, d - b, c - a);
                        else
                            box2(finish, u, y, plane, c - a, d - b, thickness);
                    }
                }
                catch (e_169_1) { e_169 = { error: e_169_1 }; }
                finally {
                    try {
                        if (regions_2_1 && !regions_2_1.done && (_f = regions_2.return)) _f.call(regions_2);
                    }
                    finally { if (e_169) throw e_169.error; }
                }
            }
            var plaster = material("#cbbda4");
            var cedar = material("#80634f");
            var sidingTones = ["#886a54", "#94735a", "#9d7b5e", "#80614f", "#a08060"].map(function (color) { return material(color); });
            box2(concrete, 0, shopFloor / 2, 0.01, 3.53, shopFloor, span + 0.07);
            var displayLeft = -1.435, displayRight = 0.515;
            var displayBottom = 0.525, displayTop = 1.935;
            var lowerBackDoor = [[0.82, 0.22, 1.55, 1.94]];
            var lowerSideWindow = [[-1.18, 0.95, -5e-3, 1.88]];
            wallPanels(cedar, "front", front - 0.05, -wallX, wallX, shopFloor, largeBeamY, [
                [displayLeft, displayBottom, displayRight, displayTop],
                [0.595, 0.46, 1.285, 2.11]
            ]);
            wallPanels(cedar, "front", rear + 0.05, -wallX, wallX, shopFloor, largeBeamY, lowerBackDoor);
            wallPanels(cedar, "side", -wallX + 0.05, rear, front, shopFloor, largeBeamY, lowerSideWindow);
            wallPanels(cedar, "side", wallX - 0.05, rear, front, shopFloor, largeBeamY, []);
            try {
                for (var _5 = __values([
                    [-wallX, displayLeft, 0.195, 2.385],
                    [displayRight, 0.595, 0.195, 2.385],
                    [1.285, wallX, 0.195, 2.385],
                    [displayLeft, displayRight, 0.195, displayBottom],
                    [displayLeft, displayRight, displayTop, 2.385]
                ]), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                    var _7 = __read(_6.value, 4), x0 = _7[0], x1 = _7[1], y0 = _7[2], y1 = _7[3];
                    box2(cedar, (x0 + x1) / 2, (y0 + y1) / 2, front - 0.05, x1 - x0, y1 - y0, 0.1);
                }
            }
            catch (e_141_1) { e_141 = { error: e_141_1 }; }
            finally {
                try {
                    if (_6 && !_6.done && (_d = _5.return)) _d.call(_5);
                }
                finally { if (e_141) throw e_141.error; }
            }
            for (var y = 0.32; y < 2.39; y += 0.19) {
                var tone = sidingTones[Math.floor(random() * sidingTones.length)];
                if (y < 0.49)
                    box2(tone, 0, y, front + 7e-3, width - 0.06, 0.027, 0.036);
                else {
                    box2(tone, -1.57, y, front + 7e-3, 0.26, 0.027, 0.036);
                    box2(tone, 1.57, y, front + 7e-3, 0.26, 0.027, 0.036);
                }
                box2(tone, wallX + 8e-3, y, -0.64, 0.035, 0.027, 2.55);
                if (y < 1.88) {
                    box2(tone, -wallX - 8e-3, y, -1.55, 0.035, 0.027, 0.73);
                    box2(tone, -wallX - 8e-3, y, 0.315, 0.035, 0.027, 0.64);
                }
                else {
                    box2(tone, -wallX - 8e-3, y, -0.64, 0.035, 0.027, 2.55);
                }
            }
            var frontClerestory = [[-0.925, 2.66, 0.485, 3.59]];
            var rearClerestory = [[-0.635, 2.76, 0.635, 3.6]];
            var leftClerestory = [[-0.41, 2.7, 0.93, 3.59]];
            var rightClerestory = [[-0.25, 2.7, 0.63, 3.55]];
            wallPanels(plaster, "front", front - 0.045, -wallX, wallX, largeBeamY, wallTop, frontClerestory);
            wallPanels(plaster, "front", rear + 0.045, -wallX, wallX, largeBeamY, wallTop, rearClerestory);
            wallPanels(plaster, "side", -wallX + 0.045, rear, front, largeBeamY, wallTop, leftClerestory);
            wallPanels(plaster, "side", wallX - 0.045, rear, front, largeBeamY, wallTop, rightClerestory);
            box2(darkWood, 0, largeBeamY, 0.01, width + 0.08, 0.13, span + 0.08);
            box2(wood, 0, wallTop - 0.044, 0.01, width + 0.085, 0.078, span + 0.092);
            try {
                for (var _8 = __values([-1.674, 1.674]), _9 = _8.next(); !_9.done; _9 = _8.next()) {
                    var x = _9.value;
                    try {
                        for (var _10 = (e_143 = void 0, __values([rear, front])), _11 = _10.next(); !_11.done; _11 = _10.next()) {
                            var z = _11.value;
                            box2(wood, x, 1.99, z, 0.093, 3.63, 0.106);
                        }
                    }
                    catch (e_143_1) { e_143 = { error: e_143_1 }; }
                    finally {
                        try {
                            if (_11 && !_11.done && (_f = _10.return)) _f.call(_10);
                        }
                        finally { if (e_143) throw e_143.error; }
                    }
                }
            }
            catch (e_142_1) { e_142 = { error: e_142_1 }; }
            finally {
                try {
                    if (_9 && !_9.done && (_e = _8.return)) _e.call(_8);
                }
                finally { if (e_142) throw e_142.error; }
            }
            try {
                for (var _12 = __values([-wallX, wallX]), _13 = _12.next(); !_13.done; _13 = _12.next()) {
                    var x = _13.value;
                    box2(wood, x, 1.28, -0.64, 0.084, 2.16, 0.071);
                    box2(wood, x, 3.1, -0.64, 0.075, 1.25, 0.07);
                    box2(paleWood, x, 0.37, 0.01, 0.089, 0.037, span - 0.18);
                }
            }
            catch (e_144_1) { e_144 = { error: e_144_1 }; }
            finally {
                try {
                    if (_13 && !_13.done && (_g = _12.return)) _g.call(_12);
                }
                finally { if (e_144) throw e_144.error; }
            }
            var gable = new THREE.BufferGeometry();
            gable.setAttribute("position", new THREE.Float32BufferAttribute([
                -wallX,
                wallTop,
                0,
                wallX,
                wallTop,
                0,
                0,
                4.63,
                0
            ], 3));
            gable.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 0.75], 2));
            gable.computeVertexNormals();
            place(shop, gable, plaster, 0, 0, front);
            place(shop, gable, plaster, 0, 0, rear).rotation.y = Math.PI;
            try {
                for (var _14 = __values([rear - 0.036, front + 0.036]), _15 = _14.next(); !_15.done; _15 = _14.next()) {
                    var z = _15.value;
                    box2(wood, 0, 4.15, z, 0.1, 0.78, 0.075);
                    try {
                        for (var _16 = (e_146 = void 0, __values([-0.69, 0.69])), _17 = _16.next(); !_17.done; _17 = _16.next()) {
                            var x = _17.value;
                            box2(wood, x, 3.98, z, 0.064, 0.32, 0.067);
                        }
                    }
                    catch (e_146_1) { e_146 = { error: e_146_1 }; }
                    finally {
                        try {
                            if (_17 && !_17.done && (_j = _16.return)) _j.call(_16);
                        }
                        finally { if (e_146) throw e_146.error; }
                    }
                    box2(darkWood, 0, 3.875, z, 2.85, 0.058, 0.063);
                }
            }
            catch (e_145_1) { e_145 = { error: e_145_1 }; }
            finally {
                try {
                    if (_15 && !_15.done && (_h = _14.return)) _h.call(_14);
                }
                finally { if (e_145) throw e_145.error; }
            }
            var roof = material("#687874");
            var roofRail = material("#6c7c74");
            var eave = 1.825;
            var ridge = 4.686;
            var eaveY = 3.765;
            var roofDepth = 4.2;
            var pitch = Math.atan2(ridge - eaveY, eave);
            var roofWidth = Math.hypot(eave, ridge - eaveY);
            var roofZ = 0.015;
            try {
                for (var _18 = __values([-1, 1]), _19 = _18.next(); !_19.done; _19 = _18.next()) {
                    var side = _19.value;
                    var rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -side * pitch);
                    box2(roof, side * eave / 2, (ridge + eaveY) / 2, roofZ, roofWidth + 0.03, 0.073, roofDepth, rotation);
                    for (var row = 0; row < 12; row++) {
                        var z2 = roofZ - roofDepth / 2 + (row + 0.5) * roofDepth / 12;
                        for (var col = 0; col < 8; col++) {
                            var along = (col + 0.5 + row % 2 * 0.5) / 8;
                            var x2 = side * (eave * along);
                            var y = ridge - (ridge - eaveY) * along;
                            var tileTone = row % 3 === 0 ? roofRail : roof;
                            box2(tileTone, x2, y, z2, roofWidth / 8 * 0.94, 0.032, roofDepth / 12 * 0.88, rotation);
                        }
                    }
                    try {
                        for (var _20 = (e_148 = void 0, __values([roofZ - roofDepth / 2, roofZ + roofDepth / 2])), _21 = _20.next(); !_21.done; _21 = _20.next()) {
                            var z2 = _21.value;
                            box2(roofRail, side * eave / 2, (ridge + eaveY) / 2 - 0.043, z2, roofWidth + 0.06, 0.081, 0.065, rotation);
                            box2(roofRail, side * eave / 2, (ridge + eaveY) / 2 + 0.014, z2, roofWidth + 0.064, 0.025, 0.072, rotation);
                        }
                    }
                    catch (e_148_1) { e_148 = { error: e_148_1 }; }
                    finally {
                        try {
                            if (_21 && !_21.done && (_l = _20.return)) _l.call(_20);
                        }
                        finally { if (e_148) throw e_148.error; }
                    }
                    for (var i = 1; i <= 6; i++) {
                        var along = i / 7;
                        box2(roofRail, side * (eave * along + 0.023), ridge - (ridge - eaveY) * along + 0.047, roofZ, 0.021, 0.027, roofDepth - 0.05, rotation);
                    }
                    rod(shop, roofRail, [side * 1.817, 3.719, -2.07], [side * 1.817, 3.719, 2.12], 0.038, 0.038, 8);
                    var x = side * 1.786;
                    var z = side === 1 ? -1.6 : 1.7;
                    tube(shop, zinc, [[side * 1.817, 3.719, z], [x, 3.62, z], [x, 3.51, z], [x, 2.5, z], [x, 1.34, z], [x, 0.135, z], [side * 1.87, 0.039, z]], 0.023);
                    try {
                        for (var _22 = (e_149 = void 0, __values([0.56, 1.7, 2.75])), _23 = _22.next(); !_23.done; _23 = _22.next()) {
                            var y = _23.value;
                            box2(darkMetal, x, y, z, 0.064, 0.034, 0.072);
                        }
                    }
                    catch (e_149_1) { e_149 = { error: e_149_1 }; }
                    finally {
                        try {
                            if (_23 && !_23.done && (_m = _22.return)) _m.call(_22);
                        }
                        finally { if (e_149) throw e_149.error; }
                    }
                    box2(darkMetal, side * 1.872, 8e-3, z, 0.159, 0.016, 0.17);
                    try {
                        for (var _24 = (e_150 = void 0, __values([-0.052, -0.026, 0, 0.026, 0.052])), _25 = _24.next(); !_25.done; _25 = _24.next()) {
                            var dz = _25.value;
                            box2(zinc, side * 1.872, 0.019, z + dz, 0.139, 9e-3, 0.013);
                        }
                    }
                    catch (e_150_1) { e_150 = { error: e_150_1 }; }
                    finally {
                        try {
                            if (_25 && !_25.done && (_o = _24.return)) _o.call(_24);
                        }
                        finally { if (e_150) throw e_150.error; }
                    }
                }
            }
            catch (e_147_1) { e_147 = { error: e_147_1 }; }
            finally {
                try {
                    if (_19 && !_19.done && (_k = _18.return)) _k.call(_18);
                }
                finally { if (e_147) throw e_147.error; }
            }
            rod(shop, roofRail, [0, ridge + 0.033, -2.105], [0, ridge + 0.033, 2.135], 0.047, 0.047, 9);
            box2(darkMetal, 0.94, 4.29, -1.21, 0.225, 0.2, 0.27);
            box2(roofRail, 0.94, 4.419, -1.21, 0.29, 0.07, 0.32);
            var display = material("#d9c1aa", { emissive: "#d48b56", emissiveIntensity: 0.2, roughness: 0.34, transparent: true, opacity: 0.38, depthWrite: false });
            var warmWindow = material("#dfc8ba", { emissive: "#f2c9a8", emissiveIntensity: 0.14, roughness: 0.24, transparent: true, opacity: 0.3, depthWrite: false });
            var glassSide = material("#b9c3c1", { roughness: 0.2, metalness: 0.08, transparent: true, opacity: 0.24, depthWrite: false });
            function windowUnit(x, y, z, w, h, glass, angle, columns, rail2) {
                var e_170, _d, e_171, _e;
                var rotation = new THREE.Quaternion().setFromAxisAngle(UP, angle);
                var rightX = Math.cos(angle);
                var rightZ = -Math.sin(angle);
                var normalX = Math.sin(angle);
                var normalZ = Math.cos(angle);
                function frame(finish, u, v, depth, w2, h2, d) {
                    joineryBox(finish, x + rightX * u + normalX * depth, y + v, z + rightZ * u + normalZ * depth, w2, h2, d, rotation);
                }
                var inset = place(shop, new THREE.PlaneGeometry(w - 0.018, h - 0.018), glass, x + normalX * 0.012, y, z + normalZ * 0.012, false);
                inset.receiveShadow = false;
                inset.rotation.y = angle;
                try {
                    for (var _f = __values([-w / 2, w / 2]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var u = _g.value;
                        frame(wood, u, 0, 0.038, 0.06, h + 0.073, 0.073);
                    }
                }
                catch (e_170_1) { e_170 = { error: e_170_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_170) throw e_170.error; }
                }
                try {
                    for (var _h = __values([-h / 2, h / 2]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var v = _j.value;
                        frame(wood, 0, v, 0.039, w - 0.06, 0.057, 0.076);
                    }
                }
                catch (e_171_1) { e_171 = { error: e_171_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_171) throw e_171.error; }
                }
                for (var i = 1; i < columns; i++)
                    frame(wood, w * (i / columns - 0.5), 0, 0.044, 0.032, h, 0.049);
                if (rail2 !== null) {
                    var pitch2 = w / columns;
                    for (var i = 0; i < columns; i++)
                        frame(wood, (i + 0.5) * pitch2 - w / 2, rail2, 0.044, pitch2 - 0.032, 0.032, 0.049);
                }
                frame(paleWood, 0, -h / 2 - 0.031, 0.056, w + 0.116, 0.038, 0.138);
                if (glass === warmWindow) {
                    var fold = material("#c6a28f");
                    var foldShade = material("#a98579");
                    for (var i = 0; i < 14; i++) {
                        var u = (i + 0.5) * w / 14 - w / 2;
                        var finish = i % 2 ? fold : foldShade;
                        frame(finish, u, 0, -9e-3, 0.025, h - 0.035, 0.018);
                    }
                    frame(wood, 0, h / 2 - 0.035, -3e-3, w + 0.02, 0.035, 0.035);
                }
            }
            box2(darkWood, 1.065, 1.26, front + 0.027, 1.1, 1.97, 0.048);
            box2(darkWood, -1.53, 1.26, front + 0.027, 0.19, 1.97, 0.048);
            box2(cedar, -0.46, 0.28, front + 0.059, 1.94, 0.41, 0.069);
            windowUnit(-0.46, 1.23, front + 0.05, 1.95, 1.41, display, 0, 3, 0.31);
            var entryX = 0.94;
            var entryHeight = 1.87;
            var entryY = shopFloor + entryHeight / 2;
            joineryBox(wood, entryX, entryY + 0.023, front + 0.06, 0.89, entryHeight + 0.047, 0.12);
            joineryBox(doorReveal, entryX, entryY + 0.018, front + 0.127, 0.79, entryHeight - 0.058, 0.038);
            place(shop, new THREE.PlaneGeometry(0.69, entryHeight - 0.34), display, entryX, entryY + 0.12, front + 0.154, false).receiveShadow = false;
            joineryBox(wood, entryX, shopFloor + 0.132, front + 0.153, 0.73, 0.23, 0.033);
            joineryBox(wood, entryX - 0.04, entryY + 0.122, front + 0.16, 0.03, entryHeight - 0.34, 0.028);
            joineryBox(paleWood, entryX - 0.12, entryY - 0.09, front + 0.175, 0.033, 0.125, 0.035);
            joineryBox(paleWood, entryX, shopFloor + 0.012, front + 0.13, 0.85, 0.024, 0.21);
            joineryBox(concrete, entryX, shopFloor * 0.24, front + 0.3725, 1.06, shopFloor * 0.52, 0.745);
            joineryBox(concrete, entryX, shopFloor * 0.75, front + 0.233, 1.01, shopFloor * 0.5, 0.454);
            box2(wood, -1.55, 1.22, front + 0.08, 0.095, 1.97, 0.119);
            windowUnit(-0.22, 3.12, front, 1.41, 0.88, warmWindow, 0, 3, 0.19);
            windowUnit(wallX, 3.13, 0.19, 0.84, 0.79, glassSide, Math.PI / 2, 2, null);
            windowUnit(-wallX, 3.15, 0.26, 1.3, 0.83, glassSide, -Math.PI / 2, 3, 0.21);
            windowUnit(0, 3.18, rear, 1.23, 0.79, glassSide, Math.PI, 2, null);
            windowUnit(-wallX, 1.41, -0.59, 1.15, 0.87, display, -Math.PI / 2, 3, null);
            joineryBox(darkWood, 1.18, shopFloor + 0.87, rear - 0.023, 0.83, 1.74, 0.072);
            joineryBox(wood, 1.18, shopFloor + 0.87, rear - 0.072, 0.69, 1.66, 0.064);
            joineryBox(zinc, 1.42, shopFloor + 0.86, rear - 0.119, 0.052, 0.046, 0.061);
            joineryBox(concrete, 1.18, shopFloor * 0.24, rear - 0.325, 1.05, shopFloor * 0.52, 0.65);
            joineryBox(concrete, 1.18, shopFloor * 0.75, rear - 0.192, 0.99, shopFloor * 0.5, 0.376);
            var sign = paintedTexture(512, 176, function (ctx, w, h) {
                var e_172, _d;
                ctx.fillStyle = "#c5ad84";
                ctx.fillRect(0, 0, w, h);
                for (var i = 0; i < 840; i++) {
                    ctx.fillStyle = random() < 0.5 ? "#f2d7ab35" : "#604b3e2d";
                    ctx.fillRect(random() * w, random() * h, 2 + random() * 14, 1);
                }
                ctx.strokeStyle = "#686b50";
                ctx.lineWidth = 3;
                ctx.strokeRect(13, 13, w - 26, h - 26);
                ctx.strokeStyle = "#777c56";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(52, 125);
                ctx.quadraticCurveTo(90, 103, 89, 56);
                ctx.stroke();
                try {
                    for (var _e = __values([[60, 68, -0.48], [90, 46, 0.21], [104, 75, 0.75]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 3), x = _g[0], y = _g[1], r = _g[2];
                        ctx.fillStyle = "#877047";
                        ctx.beginPath();
                        ctx.ellipse(x, y, 7.5, 12, r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                catch (e_172_1) { e_172 = { error: e_172_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_172) throw e_172.error; }
                }
                ctx.fillStyle = "#384f44";
                ctx.font = 'bold 96px "Yu Mincho","Yu Gothic","Microsoft YaHei",serif';
                ctx.textAlign = "center";
                ctx.fillText("\u82B1\u65E5\u548C", 290, 112);
                ctx.font = "600 17px Georgia,serif";
                ctx.fillText("H A N A B I Y O R I", 292, 144);
            });
            box2(darkWood, -0.29, 2.58, front + 0.093, 1.71, 0.49, 0.103);
            place(shop, new THREE.PlaneGeometry(1.62, 0.445), material("#fffaf0", { map: sign, emissive: "#ffdfb3", emissiveMap: sign, emissiveIntensity: 0.27 }), -0.29, 2.58, front + 0.147, false);
            var canopyCenter = -0.18;
            var canopyWidth = 2.25;
            var canopyLength = 0.62;
            var tilt = -0.269;
            var awningRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -tilt);
            box2(awning, canopyCenter, 2.246, front + 0.314, canopyWidth, 0.029, canopyLength, awningRotation);
            for (var i = 0; i < 7; i++) {
                var x = canopyCenter - canopyWidth / 2 + (i + 0.5) * canopyWidth / 7;
                box2(awningEdge, x, 2.26, front + 0.316, 0.018, 9e-3, canopyLength - 0.019, awningRotation);
            }
            var hem = new THREE.Shape();
            var panelWidth = canopyWidth / 8;
            hem.moveTo(-canopyWidth / 2, 0);
            hem.lineTo(canopyWidth / 2, 0);
            hem.lineTo(canopyWidth / 2, -0.085);
            for (var i = 8; i > 0; i--) {
                var x = -canopyWidth / 2 + i * panelWidth;
                hem.quadraticCurveTo(x - panelWidth / 2, -0.17, x - panelWidth, -0.085);
            }
            hem.closePath();
            place(shop, new THREE.ShapeGeometry(hem, 4), awningEdge, canopyCenter, 2.164, front + 0.615);
            try {
                for (var _26 = __values([-1.257, 0.897]), _27 = _26.next(); !_27.done; _27 = _26.next()) {
                    var x = _27.value;
                    rod(shop, darkMetal, [x, 1.958, front + 0.061], [x, 2.151, front + 0.595], 0.02);
                }
            }
            catch (e_151_1) { e_151 = { error: e_151_1 }; }
            finally {
                try {
                    if (_27 && !_27.done && (_p = _26.return)) _p.call(_26);
                }
                finally { if (e_151) throw e_151.error; }
            }
            var potBody = new THREE.CylinderGeometry(1, 0.74, 1, 10);
            var potRim = new THREE.CylinderGeometry(1, 0.99, 1, 10);
            var soil = material("#52483d");
            var stem = new THREE.CylinderGeometry(1, 1, 1, 5);
            var leaf = new THREE.OctahedronGeometry(1);
            var bloom = new THREE.IcosahedronGeometry(1, 0);
            var greenPalette = ["#6c744e", "#829163", "#526b4b", "#687e56", "#415d46"];
            var pink = ["#cb8581", "#d9aa9a", "#d2948b"];
            var white = ["#e4d3ae", "#d7c7a0", "#eee0c4"];
            var apricot = ["#d49d6e", "#e5b881", "#c18563"];
            var mauve = ["#a68591", "#bc9397", "#b39ca8"];
            function flowerPot(x, y, z, diameter, height, finish, colors, plantHeight, spread, count) {
                var e_173, _d;
                var radius = diameter / 2;
                var top = y + height;
                instance(potBody, tintable, x, y + height / 2, z, radius, height, radius, keyRotation, finish);
                instance(potRim, tintable, x, top - 0.012, z, radius + 0.014, 0.039, radius + 0.014, keyRotation, finish);
                instance(potRim, soil, x, top + 7e-3, z, radius - 0.016, 0.015, radius - 0.016);
                var start = new THREE.Vector3();
                var end = new THREE.Vector3();
                var delta = new THREE.Vector3();
                for (var i = 0; i < count; i++) {
                    var angle = i * 2.39996 + random() * 0.42;
                    var eccentricity = spread * (0.22 + random() * 0.78);
                    start.set(x + Math.cos(angle) * radius * 0.31, top, z + Math.sin(angle) * radius * 0.31);
                    end.set(x + Math.cos(angle) * eccentricity, top + plantHeight * (0.71 + random() * 0.36), z + Math.sin(angle) * eccentricity);
                    delta.subVectors(end, start);
                    var length = delta.length();
                    var rotation = new THREE.Quaternion().setFromUnitVectors(UP, delta.normalize());
                    var center = start.clone().lerp(end, 0.5);
                    var green = greenPalette[i % greenPalette.length];
                    instance(stem, tintable, center.x, center.y, center.z, 7e-3, length, 7e-3, rotation, green);
                    try {
                        for (var _e = (e_173 = void 0, __values([0.37, 0.66, 0.86])), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var offset = _f.value;
                            var leafAngle = angle + offset * 8;
                            var tip = new THREE.Vector3(Math.cos(leafAngle), 0.38, Math.sin(leafAngle)).normalize();
                            var at = start.clone().lerp(end, offset).addScaledVector(tip, 0.043);
                            var turn = new THREE.Quaternion().setFromUnitVectors(UP, tip);
                            var scale = plantHeight * (0.15 + random() * 0.07);
                            instance(leaf, tintable, at.x, at.y, at.z, scale * 0.44, scale, scale * 0.34, turn, green);
                        }
                    }
                    catch (e_173_1) { e_173 = { error: e_173_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                        }
                        finally { if (e_173) throw e_173.error; }
                    }
                    if (colors.length) {
                        var size = 0.032 + random() * 0.025;
                        instance(bloom, tintable, end.x, end.y, end.z, size, size * 0.7, size, keyRotation, colors[i % colors.length]);
                        instance(bloom, tintable, end.x, end.y + size * 0.44, end.z, size * 0.33, size * 0.25, size * 0.33, keyRotation, "#c79662");
                    }
                }
            }
            var shelf = material("#59493e");
            box2(shelf, -0.46, 0.88, front - 0.129, 1.86, 0.045, 0.27);
            box2(shelf, -0.46, 1.43, front - 0.129, 1.86, 0.045, 0.27);
            var displayFlowers = [
                ["#a47761", white],
                ["#87917e", pink],
                ["#a77b62", apricot],
                ["#927766", mauve],
                ["#88917d", white],
                ["#a57962", pink],
                ["#937865", apricot],
                ["#89917d", mauve]
            ];
            displayFlowers.forEach(function (_d, index) {
                var _e = __read(_d, 2), pot = _e[0], blossoms = _e[1];
                var row = Math.floor(index / 4);
                var x = -0.46 + (index % 4 - 1.5) * 0.39;
                flowerPot(x, row ? 1.455 : 0.905, front - 0.111, 0.121, 0.115, pot, blossoms, 0.25, 0.045, 6);
            });
            var workWood = material("#80624f");
            var darkInterior = material("#50443d");
            var workTopY = 0.78;
            box2(workWood, -0.3, workTopY, 0.75, 1.27, 0.085, 0.68);
            box2(darkInterior, -0.3, 0.66, 0.75, 1.14, 0.11, 0.55);
            try {
                for (var _28 = __values([-0.85, 0.25]), _29 = _28.next(); !_29.done; _29 = _28.next()) {
                    var x = _29.value;
                    try {
                        for (var _30 = (e_153 = void 0, __values([0.49, 1.01])), _31 = _30.next(); !_31.done; _31 = _30.next()) {
                            var z = _31.value;
                            box2(workWood, x, 0.43, z, 0.065, 0.62, 0.065);
                        }
                    }
                    catch (e_153_1) { e_153 = { error: e_153_1 }; }
                    finally {
                        try {
                            if (_31 && !_31.done && (_r = _30.return)) _r.call(_30);
                        }
                        finally { if (e_153) throw e_153.error; }
                    }
                }
            }
            catch (e_152_1) { e_152 = { error: e_152_1 }; }
            finally {
                try {
                    if (_29 && !_29.done && (_q = _28.return)) _q.call(_28);
                }
                finally { if (e_152) throw e_152.error; }
            }
            box2(workWood, -0.3, 0.47, 0.75, 1.14, 0.055, 0.55);
            try {
                for (var _32 = __values([
                    [-0.69, 0.865, 0.62, 0.18, 0.12, 0.17],
                    [-0.42, 0.865, 0.62, 0.18, 0.12, 0.17],
                    [-0.15, 0.865, 0.62, 0.18, 0.12, 0.17],
                    [-0.62, 0.96, 0.69, 0.28, 0.055, 0.12],
                    [-0.2, 0.96, 0.69, 0.28, 0.055, 0.12]
                ]), _33 = _32.next(); !_33.done; _33 = _32.next()) {
                    var _34 = __read(_33.value, 6), x = _34[0], y = _34[1], z = _34[2], w = _34[3], h = _34[4], d = _34[5];
                    box2(material(y > 0.9 ? "#b08b68" : "#9b765d"), x, y, z, w, h, d);
                }
            }
            catch (e_154_1) { e_154 = { error: e_154_1 }; }
            finally {
                try {
                    if (_33 && !_33.done && (_s = _32.return)) _s.call(_32);
                }
                finally { if (e_154) throw e_154.error; }
            }
            flowerPot(-0.67, 0.83, 0.94, 0.16, 0.15, "#a47761", apricot, 0.29, 0.09, 7);
            flowerPot(-0.26, 0.83, 0.84, 0.17, 0.15, "#89917d", pink, 0.31, 0.1, 8);
            flowerPot(0.05, 0.83, 0.59, 0.13, 0.13, "#987862", white, 0.25, 0.075, 6);
            var shopGlow = new THREE.PointLight("#ffe3bb", 1.24, 2.55, 2);
            shopGlow.position.set(-0.33, 1.48, 1.08);
            shop.add(shopGlow);
            lightPaint2.add(shop, [-0.3, workTopY + 0.047, 0.77], [1.23, 0.62], "#ffe1b4", 0.48, true);
            var loftFloor = material("#876951");
            var deskTop = material("#765847");
            box2(loftFloor, 0, 2.49, -0.03, width - 0.2, 0.1, span - 0.2);
            box2(deskTop, -0.18, 2.88, 1.1, 1.13, 0.075, 0.43);
            try {
                for (var _35 = __values([-0.64, 0.28]), _36 = _35.next(); !_36.done; _36 = _35.next()) {
                    var x = _36.value;
                    try {
                        for (var _37 = (e_156 = void 0, __values([0.93, 1.27])), _38 = _37.next(); !_38.done; _38 = _37.next()) {
                            var z = _38.value;
                            box2(workWood, x, 2.69, z, 0.055, 0.38, 0.055);
                        }
                    }
                    catch (e_156_1) { e_156 = { error: e_156_1 }; }
                    finally {
                        try {
                            if (_38 && !_38.done && (_u = _37.return)) _u.call(_37);
                        }
                        finally { if (e_156) throw e_156.error; }
                    }
                }
            }
            catch (e_155_1) { e_155 = { error: e_155_1 }; }
            finally {
                try {
                    if (_36 && !_36.done && (_t = _35.return)) _t.call(_35);
                }
                finally { if (e_155) throw e_155.error; }
            }
            box2(workWood, -0.18, 2.7, 1.1, 0.96, 0.045, 0.31);
            var bookColors = ["#985e4b", "#b68c66", "#6c7c67", "#c4a87f"];
            bookColors.forEach(function (color, index) { return box2(material(color), -0.48 + index * 0.14, 2.953, 1.1, 0.105, 0.065, 0.22); });
            cylinder(shop, material("#6c6554"), 0.19, 2.98, 1.06, 0.035, 0.045, 0.035, 8);
            cylinder(shop, material("#dfb37d", { emissive: "#ffb761", emissiveIntensity: 0.65 }), 0.19, 3.035, 1.06, 0.09, 0.1, 0.085, 10);
            var loftGlow = new THREE.PointLight("#ffcb9d", 0.58, 1.72, 2);
            loftGlow.position.set(0.21, 3.067, 1.06);
            shop.add(loftGlow);
            lightPaint2.add(shop, [0.13, 2.923, 1.1], [0.77, 0.41], "#ffc297", 0.46, true);
            var wrapBench = material("#775c49");
            box2(wrapBench, -1.31, 1.1, -0.59, 0.39, 0.075, 1.02);
            box2(wrapBench, -1.31, 0.72, -0.59, 0.31, 0.06, 0.88);
            try {
                for (var _39 = __values([-1.01, -0.17]), _40 = _39.next(); !_40.done; _40 = _39.next()) {
                    var z = _40.value;
                    try {
                        for (var _41 = (e_158 = void 0, __values([-1.45, -1.17])), _42 = _41.next(); !_42.done; _42 = _41.next()) {
                            var x = _42.value;
                            box2(workWood, x, 0.89, z, 0.045, 0.4, 0.045);
                        }
                    }
                    catch (e_158_1) { e_158 = { error: e_158_1 }; }
                    finally {
                        try {
                            if (_42 && !_42.done && (_w = _41.return)) _w.call(_41);
                        }
                        finally { if (e_158) throw e_158.error; }
                    }
                }
            }
            catch (e_157_1) { e_157 = { error: e_157_1 }; }
            finally {
                try {
                    if (_40 && !_40.done && (_v = _39.return)) _v.call(_39);
                }
                finally { if (e_157) throw e_157.error; }
            }
            try {
                for (var _43 = __values([
                    [-0.91, "#a47761", apricot],
                    [-0.6, "#89917d", pink],
                    [-0.29, "#987862", white]
                ]), _44 = _43.next(); !_44.done; _44 = _43.next()) {
                    var _45 = __read(_44.value, 3), z = _45[0], pot = _45[1], blossoms = _45[2];
                    flowerPot(-1.31, 1.14, z, 0.15, 0.12, pot, blossoms, 0.3, 0.075, 7);
                }
            }
            catch (e_159_1) { e_159 = { error: e_159_1 }; }
            finally {
                try {
                    if (_44 && !_44.done && (_x = _43.return)) _x.call(_43);
                }
                finally { if (e_159) throw e_159.error; }
            }
            var wrapGlow = new THREE.PointLight("#ffc995", 0.34, 1.6, 2);
            wrapGlow.position.set(-1.18, 1.45, -0.57);
            shop.add(wrapGlow);
            lightPaint2.add(shop, [-1.31, 1.143, -0.59], [0.37, 0.97], "#ffe5b8", 0.43, true);
            var loftShelf = material("#755943");
            var bookFinishes = ["#9c654f", "#b58c69", "#687b68", "#c4a779", "#806052"];
            function sideLoftRack(x, z, side) {
                var e_174, _d;
                box2(loftShelf, x, 2.68, z, 0.28, 0.055, 0.98);
                try {
                    for (var _e = __values([2.75, 3.02, 3.29]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var y = _f.value;
                        box2(loftShelf, x, y, z, 0.27, 0.04, 0.91);
                        for (var i = 0; i < 5; i++) {
                            var height = 0.13 + i % 3 * 0.035;
                            box2(material(bookFinishes[(i + (side > 0 ? 1 : 0)) % bookFinishes.length]), x - side * 0.015, y + 0.025 + height / 2, z - 0.33 + i * 0.15, 0.17, height, 0.09);
                        }
                    }
                }
                catch (e_174_1) { e_174 = { error: e_174_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_174) throw e_174.error; }
                }
            }
            sideLoftRack(-1.36, 0.26, -1);
            sideLoftRack(1.36, 0.19, 1);
            var rearCabinet = material("#745744");
            box2(rearCabinet, 0, 2.87, -1.48, 1.42, 0.56, 0.42);
            box2(workWood, 0, 3.17, -1.48, 1.5, 0.055, 0.46);
            try {
                for (var _46 = __values([-0.53, 0.53]), _47 = _46.next(); !_47.done; _47 = _46.next()) {
                    var x = _47.value;
                    box2(material(bookFinishes[Math.floor((x + 1) * 4) % bookFinishes.length]), x, 3.3, -1.48, 0.095, 0.2, 0.24);
                }
            }
            catch (e_160_1) { e_160 = { error: e_160_1 }; }
            finally {
                try {
                    if (_47 && !_47.done && (_y = _46.return)) _y.call(_46);
                }
                finally { if (e_160) throw e_160.error; }
            }
            flowerPot(-0.38, 3.2, -1.47, 0.13, 0.09, "#a47761", apricot, 0.21, 0.052, 6);
            flowerPot(0, 3.2, -1.47, 0.14, 0.09, "#89917d", pink, 0.23, 0.055, 7);
            flowerPot(0.38, 3.2, -1.47, 0.13, 0.09, "#987862", white, 0.21, 0.052, 6);
            var rearGlow = new THREE.PointLight("#ffca93", 0.32, 1.7, 2);
            rearGlow.position.set(0, 3.12, -1.23);
            shop.add(rearGlow);
            lightPaint2.add(shop, [0.04, 3.202, -1.48], [1.22, 0.43], "#ffcd95", 0.4, true);
            try {
                for (var _48 = __values([[-1.36, 0.26], [1.36, 0.19]]), _49 = _48.next(); !_49.done; _49 = _48.next()) {
                    var _50 = __read(_49.value, 2), x = _50[0], z = _50[1];
                    lightPaint2.add(shop, [x, 3.313, z], [0.27, 0.85], "#e4c5a8", 0.36, true);
                }
            }
            catch (e_161_1) { e_161 = { error: e_161_1 }; }
            finally {
                try {
                    if (_49 && !_49.done && (_z = _48.return)) _z.call(_48);
                }
                finally { if (e_161) throw e_161.error; }
            }
            var crate = material("#84674f");
            try {
                for (var _51 = __values([[-1.04, 0.17, 2.23, 0.97, 0.48], [-1.29, 0.08, 2.795, 0.58, 0.4]]), _52 = _51.next(); !_52.done; _52 = _51.next()) {
                    var _53 = __read(_52.value, 5), x = _53[0], y = _53[1], z = _53[2], w = _53[3], d = _53[4];
                    box2(wood, x, y - 0.052, z, w, 0.066, d);
                    try {
                        for (var _54 = (e_163 = void 0, __values([-1, 1])), _55 = _54.next(); !_55.done; _55 = _54.next()) {
                            var side = _55.value;
                            box2(crate, x + side * (w / 2 - 0.023), y + 0.028, z, 0.046, 0.12, d);
                            box2(crate, x, y + 0.033, z + side * (d / 2 - 0.025), w, 0.095, 0.039);
                        }
                    }
                    catch (e_163_1) { e_163 = { error: e_163_1 }; }
                    finally {
                        try {
                            if (_55 && !_55.done && (_1 = _54.return)) _1.call(_54);
                        }
                        finally { if (e_163) throw e_163.error; }
                    }
                    for (var i = 1; i <= 4; i++)
                        box2(paleWood, x + (i / 5 - 0.5) * w, y + 0.01, z, 0.036, 0.029, d - 0.026);
                }
            }
            catch (e_162_1) { e_162 = { error: e_162_1 }; }
            finally {
                try {
                    if (_52 && !_52.done && (_0 = _51.return)) _0.call(_51);
                }
                finally { if (e_162) throw e_162.error; }
            }
            flowerPot(-1.3, 0.24, 2.15, 0.27, 0.23, "#818983", white, 0.29, 0.144, 7);
            flowerPot(-0.96, 0.24, 2.24, 0.28, 0.24, "#989f93", pink, 0.4, 0.167, 9);
            flowerPot(-0.63, 0.24, 2.14, 0.25, 0.2, "#a47761", apricot, 0.32, 0.133, 8);
            flowerPot(-1.42, 0.14, 2.76, 0.24, 0.17, "#a5745d", mauve, 0.31, 0.126, 7);
            flowerPot(-1.17, 0.14, 2.79, 0.24, 0.18, "#8a9286", white, 0.26, 0.13, 7);
            flowerPot(-0.69, 0, 2.74, 0.33, 0.34, "#7d8a84", apricot, 0.42, 0.194, 11);
            flowerPot(-0.25, 0, 2.47, 0.26, 0.22, "#997c63", pink, 0.34, 0.162, 8);
            flowerPot(1.68, 0, 2.34, 0.34, 0.32, "#a47760", [], 0.6, 0.24, 10);
            flowerPot(1.64, 0, 2.82, 0.22, 0.2, "#81948a", white, 0.26, 0.13, 6);
            flowerPot(-1.83, 0, 1.52, 0.29, 0.25, "#a27d65", [], 0.53, 0.2, 9);
            var can = material("#7b9283", { metalness: 0.26 });
            cylinder(shop, can, -0.27, 0.086, 2.85, 0.092, 0.1, 0.164, 9);
            rod(shop, can, [-0.32, 0.09, 2.85], [-0.49, 0.203, 2.89], 0.025, 0.017, 6);
            rod(shop, can, [-0.49, 0.203, 2.89], [-0.52, 0.225, 2.9], 0.035, 0.035, 8);
            tube(shop, can, [[-0.225, 0.063, 2.86], [-0.154, 0.095, 2.86], [-0.151, 0.155, 2.86], [-0.217, 0.166, 2.86]], 0.013);
            cylinder(shop, darkMetal, 1.91, 0.23, 1.28, 0.092, 0.095, 0.46, 9);
            cylinder(shop, zinc, 1.91, 0.468, 1.28, 0.1, 0.1, 0.035, 9);
            box2(concrete, 0.15, 0.34, rear - 0.04, 0.43, 0.4, 0.1);
            box2(zinc, 0.15, 0.51, rear - 0.1, 0.48, 0.06, 0.14);
            var sconce = material("#f1d4a5", { emissive: "#ffbe7f", emissiveIntensity: 1.1 });
            rod(shop, darkMetal, [1.39, 2.22, front + 0.025], [1.39, 2.22, front + 0.19], 0.026);
            cylinder(shop, darkMetal, 1.39, 2.191, front + 0.187, 0.044, 0.093, 0.068, 8);
            cylinder(shop, sconce, 1.39, 2.14, front + 0.187, 0.054, 0.045, 0.061, 8);
            var spill = new THREE.PointLight("#ffc593", 1.6, 2.3, 2);
            spill.position.set(0.96, 1.97, front + 0.39);
            spill.userData.airGlow = 0.8;
            shop.add(spill);
            lightPaint2.add(shop, [1.15, 3e-3, front + 0.75], [1.27, 1.23], "#ffc794", 0.3, true);
            try {
                for (var _56 = __values([[batches, true], [joineryBatches, false]]), _57 = _56.next(); !_57.done; _57 = _56.next()) {
                    var _58 = __read(_57.value, 2), batch = _58[0], shadows = _58[1];
                    try {
                        for (var batch_1 = (e_165 = void 0, __values(batch)), batch_1_1 = batch_1.next(); !batch_1_1.done; batch_1_1 = batch_1.next()) {
                            var _59 = __read(batch_1_1.value, 2), geometry = _59[0], byFinish = _59[1];
                            var _loop_13 = function (finish, parts) {
                                var mesh = new THREE.InstancedMesh(geometry, finish, parts.length);
                                mesh.castShadow = shadows;
                                mesh.receiveShadow = shadows;
                                parts.forEach(function (_d, index) {
                                    var matrix2 = _d.matrix, color = _d.color;
                                    mesh.setMatrixAt(index, matrix2);
                                    if (color)
                                        mesh.setColorAt(index, new THREE.Color(color));
                                });
                                shop.add(mesh);
                            };
                            try {
                                for (var byFinish_1 = (e_166 = void 0, __values(byFinish)), byFinish_1_1 = byFinish_1.next(); !byFinish_1_1.done; byFinish_1_1 = byFinish_1.next()) {
                                    var _60 = __read(byFinish_1_1.value, 2), finish = _60[0], parts = _60[1];
                                    _loop_13(finish, parts);
                                }
                            }
                            catch (e_166_1) { e_166 = { error: e_166_1 }; }
                            finally {
                                try {
                                    if (byFinish_1_1 && !byFinish_1_1.done && (_4 = byFinish_1.return)) _4.call(byFinish_1);
                                }
                                finally { if (e_166) throw e_166.error; }
                            }
                        }
                    }
                    catch (e_165_1) { e_165 = { error: e_165_1 }; }
                    finally {
                        try {
                            if (batch_1_1 && !batch_1_1.done && (_3 = batch_1.return)) _3.call(batch_1);
                        }
                        finally { if (e_165) throw e_165.error; }
                    }
                }
            }
            catch (e_164_1) { e_164 = { error: e_164_1 }; }
            finally {
                try {
                    if (_57 && !_57.done && (_2 = _56.return)) _2.call(_56);
                }
                finally { if (e_164) throw e_164.error; }
            }
        }
        function buildShops(parent, lightPaint2) {
            var e_175, _d, e_176, _e, e_177, _f, e_178, _g;
            var shops2 = new THREE.Group();
            shops2.name = "\u5915\u51EA\u8ED2 and the vending corner";
            parent.add(shops2);
            var ramen = new THREE.Group();
            var vending = new THREE.Group();
            ramen.position.x = -4.32;
            vending.position.set(3.09, 0, 0.82);
            shops2.add(ramen, vending);
            var storefront = ramen;
            var cube = new THREE.BoxGeometry(1, 1, 1);
            var quad = new THREE.PlaneGeometry(1, 1);
            var japanese = '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif';
            var sans = '"Yu Gothic", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif';
            var paint = function (color, extra) {
                if (extra === void 0) { extra = {}; }
                return new THREE.MeshStandardMaterial(__spreadValues({ color: color, roughness: 0.85 }, extra));
            };
            var iron = paint(3028025, { metalness: 0.28 });
            var darkWood = paint(5583660);
            var timber = paint(11232066);
            var plank = [9854019, 11234124, 11431242, 9130043, 12944469].map(function (color) { return paint(color); });
            var stucco = paint(12424559);
            var roof = paint(3688010, { metalness: 0.15 });
            var roofEdge = paint(5920594, { metalness: 0.16 });
            var darkRecess = paint(3154466);
            var amber = paint(16760944, { emissive: 13982227, emissiveIntensity: 0.6 });
            var slate = paint(7635069);
            var concrete = paint(10588282);
            var glass = paint(6189942, { roughness: 0.22, metalness: 0.25 });
            var paleEnamel = paint(15851455, { roughness: 0.31 });
            var skyEnamel = paint(4230833, { roughness: 0.32 });
            var whitePorcelain = paint(16179124, { roughness: 0.27 });
            var lacquer = paint(8731952, { roughness: 0.34 });
            var redPaper = paint(13921365, { emissive: 12660504, emissiveIntensity: 0.25 });
            var foliage = [7437387, 9672520, 5465678].map(function (color) { return paint(color); });
            var leafGeo = new THREE.IcosahedronGeometry(0.12, 0);
            function mesh(geometry, material2, x, y, z, cast) {
                if (cast === void 0) { cast = true; }
                var part = new THREE.Mesh(geometry, material2);
                part.position.set(x, y, z);
                part.castShadow = cast;
                part.receiveShadow = true;
                storefront.add(part);
                return part;
            }
            function box2(x, y, z, width, height, depth, material2, cast) {
                if (cast === void 0) { cast = true; }
                var part = mesh(cube, material2, x, y, z, cast);
                part.scale.set(width, height, depth);
                return part;
            }
            function tube2(x, y, z, top, base, height, material2, sides) {
                if (sides === void 0) { sides = 12; }
                return mesh(new THREE.CylinderGeometry(top, base, height, sides), material2, x, y, z);
            }
            function art(width, height, draw) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                draw(canvas.getContext("2d"), width, height);
                var texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.anisotropy = 4;
                return texture;
            }
            function print(texture, glow, side) {
                if (glow === void 0) { glow = 0; }
                if (side === void 0) { side = THREE.FrontSide; }
                return new THREE.MeshStandardMaterial({
                    map: texture,
                    emissiveMap: texture,
                    emissive: 16777215,
                    emissiveIntensity: glow,
                    roughness: 0.68,
                    side: side
                });
            }
            function billboard(texture, x, y, z, width, height, glow) {
                if (glow === void 0) { glow = 0; }
                var board = mesh(quad, print(texture, glow), x, y, z, false);
                board.scale.set(width, height, 1);
                return board;
            }
            function words(ctx, label, x, y, size, color, family, weight) {
                if (family === void 0) { family = japanese; }
                if (weight === void 0) { weight = 700; }
                ctx.font = "".concat(weight, " ").concat(size, "px ").concat(family);
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = color;
                ctx.fillText(label, x, y);
            }
            function stripeGrain(ctx, w, h, base, line) {
                ctx.fillStyle = base;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = line;
                for (var i = 0; i < 73; i++) {
                    var y = i * 39.3 % h;
                    ctx.fillRect(i * 83.8 % w - 30, y, 40 + i * 179 % 173, i % 3 ? 1 : 2);
                }
            }
            var shopSign = art(1024, 248, function (ctx, w, h) {
                stripeGrain(ctx, w, h, "#f1cf97", "#9c683920");
                ctx.strokeStyle = "#9a4231";
                ctx.lineWidth = 5;
                ctx.strokeRect(18, 18, w - 36, h - 36);
                ctx.strokeRect(29, 29, w - 58, h - 58);
                words(ctx, "\u5915 \u51EA \u8ED2", w / 2, 112, 116, "#4a271e");
                words(ctx, "\u4E2D \u83EF \u305D \u3070   \uFF0F   Y \u016A N A G I", w / 2, 196, 25, "#a44632", sans);
                [126, w - 126].forEach(function (x) {
                    ctx.strokeStyle = "#9a4231";
                    ctx.lineWidth = 4;
                    [0, 1, 2].forEach(function (i) {
                        ctx.beginPath();
                        ctx.arc(x, 121, 11 + i * 12, Math.PI, Math.PI * 2);
                        ctx.stroke();
                    });
                    ctx.fillStyle = "#9a4231";
                    ctx.fillRect(x - 35, 123, 70, 4);
                });
            });
            var menu = art(256, 390, function (ctx, w, h) {
                stripeGrain(ctx, w, h, "#283735", "#b5b69a12");
                ctx.strokeStyle = "#dbc292";
                ctx.lineWidth = 2;
                ctx.strokeRect(13, 13, w - 26, h - 26);
                words(ctx, "\u304A\u3057\u306A\u304C\u304D", w / 2, 57, 31, "#f0dba8");
                ["\u4E2D\u83EF\u305D\u3070", "\u713C\u304D\u9903\u5B50", "\u74F6\u30D3\u30FC\u30EB"].forEach(function (dish, i) {
                    words(ctx, dish, 91, 119 + i * 65, 24, "#f1e8cf", sans);
                    words(ctx, ["650", "350", "500"][i], 198, 119 + i * 65, 21, "#f1e8cf", sans, 500);
                });
                for (var i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.ellipse(100 + i * 25, 305, 4, 15, 0.38, 0, Math.PI * 2);
                    ctx.fillStyle = "#e5a779";
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.moveTo(78, 326);
                ctx.quadraticCurveTo(125, 387, 177, 326);
                ctx.closePath();
                ctx.stroke();
            });
            var paper = art(512, 432, function (ctx, w, h) {
                var tint = ctx.createLinearGradient(0, 0, 0, h);
                tint.addColorStop(0, "#ed754e");
                tint.addColorStop(0.5, "#ffc375");
                tint.addColorStop(1, "#df5f3d");
                ctx.fillStyle = tint;
                ctx.fillRect(0, 0, w, h);
                for (var i = 16; i < h; i += 16) {
                    ctx.fillStyle = "#8f2f17a0";
                    ctx.fillRect(0, i, w, 2);
                    ctx.fillStyle = "#fff0b857";
                    ctx.fillRect(0, i + 3, w, 1);
                }
                __spreadArray([], __read("\u4E2D\u83EF\u305D\u3070"), false).forEach(function (glyph, i) { return words(ctx, glyph, w / 2, 94 + i * 81, 73, "#5b231c"); });
            });
            var clothPrint = [0, 1, 2, 3].map(function (i) { return art(192, 250, function (ctx, w, h) {
                stripeGrain(ctx, w, h, i % 2 ? "#883d34" : "#9b4a3a", "#eabf8822");
                ctx.fillStyle = "#53292195";
                ctx.fillRect(6, 8, 2, h - 18);
                ctx.fillRect(w - 8, 8, 2, h - 18);
                ctx.fillRect(6, h - 11, w - 12, 2);
                words(ctx, "\u4E2D\u83EF\u305D\u3070"[i], w / 2, 113, 102, "#f8deb1");
                ctx.strokeStyle = "#f8deb1";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(58, 168);
                ctx.lineTo(134, 168);
                ctx.stroke();
            }); });
            box2(0.09, 0.25, -3.07, 5.12, 0.14, 2.15, concrete);
            box2(0.09, 1.64, -4.14, 5.13, 2.78, 0.14, stucco);
            box2(0.09, 3.04, -3.12, 5.13, 0.2, 2.28, darkWood);
            [-2.48, 2.65].forEach(function (x) {
                box2(x, 1.35, -3.13, 0.105, 2.32, 2.09, darkWood);
                for (var row = 0; row < 11; row++) {
                    box2(x, 0.4 + row * 0.241, -3.11, 0.135, 0.227, 1.98, plank[row % 5]);
                }
                [-4.08, -2.12].forEach(function (z) { return box2(x, 1.61, z, 0.19, 2.83, 0.17, darkWood); });
            });
            box2(-0.7, 1.72, -3.74, 3.34, 2.38, 0.09, darkRecess);
            box2(1.84, 1.62, -2.065, 1.51, 2.64, 0.11, darkWood);
            box2(1.85, 1.82, -2, 1.18, 2.04, 0.028, amber, false);
            box2(1.85, 0.59, -1.974, 1.18, 0.57, 0.045, timber);
            for (var i = 0; i < 8; i++)
                box2(1.32 + i * 0.15, 1.81, -1.965, 0.029, 1.94, 0.045, darkWood);
            [1.04, 1.77, 2.69].forEach(function (y) { return box2(1.85, y, -1.965, 1.2, 0.045, 0.052, darkWood); });
            box2(1.48, 1.3, -1.914, 0.037, 0.18, 0.038, iron);
            box2(1.83, 0.23, -1.79, 1.33, 0.1, 0.38, concrete);
            [-2.37, 0.82, 2.57].forEach(function (x) {
                box2(x, 1.62, -2.01, 0.17, 2.81, 0.2, darkWood);
                box2(x, 0.41, -1.995, 0.23, 0.16, 0.24, slate);
            });
            box2(-0.77, 0.72, -2.29, 3.09, 0.74, 0.28, darkWood);
            for (var i = 0; i < 13; i++) {
                box2(-2.13 + i * 0.23, 0.68, -2.13, 0.21, 0.65, 0.06, plank[(i + 2) % 5]);
            }
            box2(-0.78, 1.1, -2.28, 3.45, 0.125, 0.68, timber);
            box2(-0.78, 1.052, -1.921, 3.47, 0.065, 0.09, darkWood);
            for (var i = 0; i < 3; i++) {
                var x = -1.72 + i * 0.88;
                tube2(x, 0.7, -1.39, 0.23, 0.205, 0.087, lacquer);
                tube2(x, 0.44, -1.39, 0.043, 0.062, 0.49, iron);
                tube2(x, 0.233, -1.39, 0.15, 0.16, 0.045, iron);
                tube2(x + 0.13, 1.21, -2.22, 0.112, 0.074, 0.105, whitePorcelain);
                tube2(x + 0.13, 1.266, -2.22, 0.101, 0.101, 0.013, lacquer, 16);
                box2(x + 0.29, 1.173, -2.22, 0.019, 0.015, 0.2, darkWood).rotation.y = 0.24;
            }
            box2(-0.99, 1.39, -3.64, 2.22, 0.075, 0.33, darkWood);
            box2(-1.1, 1.05, -3.28, 2.45, 0.12, 0.56, timber);
            var steel = paint(9143680, { roughness: 0.44, metalness: 0.36 });
            box2(-0.3, 0.76, -3.27, 0.66, 0.48, 0.51, slate);
            box2(-0.3, 1.13, -3.27, 0.57, 0.044, 0.44, iron);
            tube2(-0.3, 1.255, -3.28, 0.171, 0.145, 0.21, steel, 16);
            tube2(-0.3, 1.366, -3.28, 0.174, 0.174, 0.025, steel, 16);
            tube2(-0.3, 1.395, -3.28, 0.043, 0.048, 0.035, darkWood, 10);
            try {
                for (var _h = __values([-0.201, 0.201]), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var dx = _j.value;
                    box2(-0.3 + dx, 1.29, -3.28, 0.095, 0.034, 0.064, iron, false);
                }
            }
            catch (e_175_1) { e_175 = { error: e_175_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                }
                finally { if (e_175) throw e_175.error; }
            }
            box2(-1.31, 1.137, -3.26, 0.4, 0.038, 0.3, timber, false);
            box2(-1.29, 1.172, -3.27, 0.24, 0.016, 0.069, steel, false).rotation.y = 0.23;
            box2(-1.44, 1.174, -3.235, 0.105, 0.026, 0.035, darkWood, false).rotation.y = 0.23;
            for (var i = 0; i < 4; i++) {
                var y = 1.16 + i * 0.035;
                tube2(-1.93, y, -3.19, 0.115, 0.076, 0.039, whitePorcelain, 12);
            }
            box2(-1.67, 2.33, -3.54, 1.28, 0.033, 0.039, iron, false);
            for (var i = 0; i < 4; i++) {
                var x = -2.12 + i * 0.22;
                box2(x, 2.14, -3.54, 0.024, 0.29, 0.021, steel, false);
                tube2(x, 1.978, -3.54, 0.048, 0.034, 0.051, steel, 8);
            }
            box2(0.53, 0.89, -3.41, 0.47, 0.45, 0.52, slate, false);
            box2(0.53, 1.13, -3.41, 0.5, 0.038, 0.55, steel, false);
            box2(0.52, 1.154, -3.42, 0.28, 0.013, 0.25, iron, false);
            var bottleColors = [paint(9351029), paint(10446406), paint(13541227), paint(7441267)];
            for (var i = 0; i < 8; i++) {
                var x = -2.02 + i * 0.267;
                var h = 0.21 + i % 3 * 0.04;
                tube2(x, 1.44 + h / 2, -3.6, 0.053, 0.059, h, bottleColors[i % 4]);
                tube2(x, 1.46 + h, -3.6, 0.024, 0.038, 0.065, bottleColors[i % 4]);
                box2(x, 1.53, -3.537, 0.073, 0.083, 6e-3, paleEnamel, false);
            }
            var paperPanels = [16299885, 14916190, 15974534].map(function (color) { return paint(color, { emissive: color, emissiveIntensity: 0.54 }); });
            function shojiScreen(x, y, z, width, height, angle) {
                var frame = new THREE.Group();
                frame.position.set(x, y, z);
                frame.rotation.y = angle;
                ramen.add(frame);
                var part = function (finish, u, v, w, h, depth, offset) {
                    if (offset === void 0) { offset = 0; }
                    var mesh2 = new THREE.Mesh(cube, finish);
                    mesh2.position.set(u, v, offset);
                    mesh2.scale.set(w, h, depth);
                    mesh2.receiveShadow = true;
                    frame.add(mesh2);
                };
                var columns = width > 1.5 ? 7 : 4;
                var pitch = width / columns;
                var rowHeight = height / 3;
                for (var row = 0; row < 3; row++)
                    for (var col = 0; col < columns; col++) {
                        part(paperPanels[(row * 2 + col) % 3], (col + 0.5) * pitch - width / 2, (row - 1) * rowHeight, pitch - 0.018, rowHeight - 0.022, 0.022);
                    }
                for (var col = 0; col <= columns; col++)
                    part(darkWood, col * pitch - width / 2, 0, 0.027, height + 0.028, 0.048, 0.013);
                for (var row = 0; row <= 3; row++)
                    part(darkWood, 0, row * rowHeight - height / 2, width + 0.027, 0.028, 0.048, 0.013);
            }
            shojiScreen(-0.83, 2.11, -3.656, 2.42, 0.92, 0);
            shojiScreen(2.745, 1.88, -3.08, 0.98, 0.79, Math.PI / 2);
            var shopLight = new THREE.PointLight(16758901, 8, 4.4, 2);
            shopLight.position.set(-0.57, 2.14, -2.59);
            ramen.add(shopLight);
            lightPaint2.add(ramen, [-0.78, 1.169, -2.29], [3.34, 0.6], "#ffbf80", 0.45, true);
            lightPaint2.add(ramen, [-1.17, 1.117, -3.26], [2.06, 0.51], "#ffd397", 0.43, true);
            var windowLight = new THREE.PointLight(16753254, 2.8, 3.1, 2);
            windowLight.position.set(1.86, 1.73, -1.71);
            ramen.add(windowLight);
            var frontSlope = box2(0.08, 3.52, -2.61, 5.52, 0.104, 1.91, roof);
            frontSlope.rotation.x = 0.285;
            var backSlope = box2(0.08, 3.52, -3.95, 5.52, 0.106, 0.91, roof);
            backSlope.rotation.x = -0.56;
            box2(0.08, 3.82, -3.51, 5.61, 0.12, 0.15, roofEdge);
            box2(0.08, 3.29, -1.693, 5.57, 0.135, 0.12, roofEdge);
            for (var i = 0; i < 22; i++) {
                var x = -2.58 + i * 0.254;
                box2(x, 3.58, -2.61, 0.027, 0.04, 1.9, roofEdge).rotation.x = 0.285;
                if (i % 2 === 0)
                    box2(x, 3.24, -1.865, 0.08, 0.08, 0.38, darkWood);
            }
            box2(-0.29, 3.019, -1.664, 3.26, 0.52, 0.091, darkWood);
            billboard(shopSign, -0.29, 3.02, -1.613, 3.16, 0.465, 0.27);
            var norenRod = tube2(-0.73, 2.71, -1.91, 0.026, 0.026, 3.05, timber);
            norenRod.rotation.z = Math.PI / 2;
            for (var i = 0; i < 4; i++) {
                var curtain = new THREE.PlaneGeometry(0.68, 0.71, 14, 9);
                var vertices = curtain.attributes.position;
                for (var j = 0; j < vertices.count; j++) {
                    var x = vertices.getX(j);
                    var y = vertices.getY(j);
                    var drop = (0.355 - y) / 0.71;
                    vertices.setZ(j, 0.065 * drop * Math.sin(x * 15 + i) - drop * drop * 0.05);
                    vertices.setY(j, y + drop * 0.022 * Math.cos(x * 14));
                }
                curtain.computeVertexNormals();
                mesh(curtain, print(clothPrint[i], 0.06, THREE.DoubleSide), -1.825 + i * 0.73, 2.348, -1.901);
            }
            var lanternProfile = [
                [0, -0.32],
                [0.095, -0.32],
                [0.13, -0.28],
                [0.18, -0.21],
                [0.203, -0.11],
                [0.204, 0.11],
                [0.18, 0.21],
                [0.13, 0.28],
                [0.095, 0.32]
            ];
            var lanternGeo = new THREE.LatheGeometry(lanternProfile.map(function (_d) {
                var _e = __read(_d, 2), x = _e[0], y = _e[1];
                return new THREE.Vector2(x, y);
            }), 24);
            var lanternMaterial = print(paper, 1.12);
            [-2.34, 2.24].forEach(function (x) {
                tube2(x, 2.996, -1.661, 0.013, 0.013, 0.371, iron, 8);
                tube2(x, 2.791, -1.661, 0.103, 0.103, 0.055, iron);
                mesh(lanternGeo, lanternMaterial, x, 2.451, -1.661, false).rotation.y = Math.PI;
                tube2(x, 2.112, -1.661, 0.101, 0.095, 0.047, darkWood);
                tube2(x, 2.059, -1.661, 0.021, 0.021, 0.09, redPaper, 8);
                var lanternLight = new THREE.PointLight(16752988, 6.2, 4.4, 2);
                lanternLight.position.set(x, 1.91, -1.15);
                lanternLight.userData.airGlow = 0.9;
                ramen.add(lanternLight);
                lightPaint2.add(ramen, [x, 0.184, -0.92], [1.36, 1.48], "#ffad76", 0.31, true);
            });
            var sandwichBoard = box2(-2.13, 0.65, -1.05, 0.49, 0.78, 0.04, darkWood);
            sandwichBoard.rotation.x = -0.13;
            sandwichBoard.rotation.y = 0.17;
            var sandwichPoster = billboard(menu, -2.127, 0.65, -1.023, 0.45, 0.74, 0.06);
            sandwichPoster.rotation.copy(sandwichBoard.rotation);
            [-2.33, -1.93].forEach(function (x) {
                box2(x, 0.577, -1.082, 0.047, 0.815, 0.08, timber).rotation.x = -0.13;
                box2(x, 0.566, -1.23, 0.051, 0.79, 0.085, darkWood).rotation.x = 0.32;
            });
            function planter(x, z, scale) {
                tube2(x, 0.185 + 0.2 * scale, z, 0.233 * scale, 0.165 * scale, 0.4 * scale, lacquer, 8);
                tube2(x, 0.185 + 0.4 * scale, z, 0.236 * scale, 0.226 * scale, 0.06 * scale, timber, 8);
                tube2(x, 0.205 + 0.4 * scale, z, 0.208 * scale, 0.208 * scale, 0.022 * scale, darkRecess, 8);
                for (var i = 0; i < 10; i++) {
                    var angle = i * 2.399963;
                    var radius = (0.07 + 0.018 * i) * scale;
                    var length = (0.16 + i % 3 * 0.067) * scale;
                    var leaf = mesh(leafGeo, foliage[i % 3], x + Math.sin(angle) * radius, 0.18 + 0.57 * scale + i % 3 * 0.09 * scale, z + Math.cos(angle) * radius);
                    leaf.scale.set(scale * 0.72, length * 7, scale * 0.5);
                    leaf.rotation.set(Math.cos(angle) * 0.68, angle, Math.sin(angle) * 0.68);
                }
            }
            planter(-2.82, -1.88, 0.94);
            planter(2.71, -1.16, 0.67);
            var crateColor = paint(5864311);
            for (var layer = 0; layer < 2; layer++) {
                var y = 0.31 + layer * 0.251;
                box2(2.37, y, -1.34, 0.48, 0.24, 0.34, crateColor);
                if (layer === 1) {
                    for (var i = 0; i < 5; i++) {
                        tube2(2.188 + i * 0.087, y + 0.155, -1.32, 0.029, 0.037, 0.13, bottleColors[i % 4], 7);
                        tube2(2.188 + i * 0.087, y + 0.226, -1.32, 0.019, 0.024, 0.055, iron, 7);
                    }
                }
                for (var i = 0; i < 4; i++)
                    box2(2.22 + i * 0.1, y + 0.03, -1.166, 0.069, 0.093, 8e-3, darkRecess, false);
                box2(2.37, y + 0.109, -1.34, 0.52, 0.039, 0.36, crateColor);
            }
            var drinkColors = ["#ed7a5f", "#6192d3", "#ffc675", "#8bb48e", "#ddd6ab", "#519b91", "#d9a3bb"];
            var display = function (variant) { return art(512, 544, function (ctx, w, h) {
                var wash = ctx.createLinearGradient(0, 0, w, h);
                wash.addColorStop(0, "#e9fbde");
                wash.addColorStop(0.5, "#cadcdb");
                wash.addColorStop(1, "#b1c9d2");
                ctx.fillStyle = wash;
                ctx.fillRect(0, 0, w, h);
                words(ctx, variant ? "\u3042\u3063\u305F\u304B\u30FB\u3064\u3081\u305F\u3044" : "\u3064\u3081\u305F\u301C\u3044", w / 2, 31, 31, "#255674", sans);
                for (var row = 0; row < 3; row++) {
                    var floor = 176 + row * 161;
                    for (var col = 0; col < 7; col++) {
                        var x = 21 + col * 68;
                        var bottle = (col + row + variant) % 3 !== 1;
                        var height = bottle ? 100 + 9 * ((row + col) % 3) : 78;
                        var top = floor - height;
                        var dye = drinkColors[(col * 3 + row * 2 + variant) % drinkColors.length];
                        ctx.fillStyle = "#5370794d";
                        ctx.fillRect(x + 5, top + 8, 45, height - 3);
                        if (bottle) {
                            ctx.fillStyle = dye;
                            ctx.beginPath();
                            ctx.moveTo(x + 17, top + 9);
                            ctx.lineTo(x + 33, top + 9);
                            ctx.lineTo(x + 34, top + 24);
                            ctx.quadraticCurveTo(x + 46, top + 35, x + 46, top + 47);
                            ctx.lineTo(x + 46, floor);
                            ctx.lineTo(x + 4, floor);
                            ctx.lineTo(x + 4, top + 47);
                            ctx.quadraticCurveTo(x + 4, top + 34, x + 16, top + 24);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = "#536364";
                            ctx.fillRect(x + 16, top + 4, 19, 8);
                        }
                        else {
                            ctx.fillStyle = dye;
                            ctx.fillRect(x + 4, top, 42, height);
                            ctx.fillStyle = "#e4e1b2";
                            ctx.fillRect(x + 7, top, 36, 5);
                        }
                        ctx.fillStyle = "#fff3d7";
                        ctx.fillRect(x + 5, floor - 51, 40, 31);
                        words(ctx, ["\u8336", "\u6C34", "\u73C8\u7432", "\u6843", "\u8336", "\u67DA", "\u6C34"][(col + row) % 7], x + 25, floor - 36, 15, "#3c5147", sans);
                        ctx.fillStyle = "#ffffff60";
                        ctx.fillRect(x + 9, floor - 63, 3, 55);
                    }
                    ctx.fillStyle = row === 2 && variant ? "#a84e3a" : "#34596d";
                    ctx.fillRect(0, floor, w, 29);
                    for (var col = 0; col < 7; col++) {
                        var x = 47 + col * 68;
                        words(ctx, col % 2 ? "140" : "120", x, floor + 8, 13, "#fff2c9", sans);
                        ctx.fillStyle = "#9bd1ad";
                        ctx.fillRect(x - 11, floor + 18, 22, 5);
                    }
                }
                ctx.fillStyle = "#ffffff36";
                ctx.beginPath();
                ctx.moveTo(242, 0);
                ctx.lineTo(280, 0);
                ctx.lineTo(77, h);
                ctx.lineTo(44, h);
                ctx.closePath();
                ctx.fill();
            }); };
            var machineBrand = function (variant) { return art(512, 132, function (ctx, w, h) {
                ctx.fillStyle = variant ? "#ae4f46" : "#226288";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#f3e6c6";
                ctx.lineWidth = 2;
                ctx.strokeRect(9, 9, w - 18, h - 18);
                words(ctx, variant ? "\u3042\u304B\u306D\u73C8\u7432" : "\u3057\u304A\u304B\u305C", w / 2, 50, 59, "#fff3cf", sans);
                words(ctx, variant ? "A K A N E   /   C O F F E E" : "S H I O K A Z E   /   S O D A", w / 2, 102, 17, "#fff3cf", sans);
            }); };
            var canTexture = function (variant) { return art(256, 264, function (ctx, w, h) {
                ctx.fillStyle = variant ? "#e8d4aa" : "#5a99bc";
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.translate(130, 124);
                ctx.rotate(-0.24);
                ctx.fillStyle = variant ? "#a75248" : "#f1dbad";
                ctx.fillRect(-44, -64, 88, 133);
                ctx.fillStyle = "#a9b1a8";
                ctx.fillRect(-44, -67, 88, 10);
                ctx.fillRect(-44, 63, 88, 8);
                words(ctx, variant ? "\u73C8\u7432" : "\u70AD\u9178", 0, 4, 32, variant ? "#f1dbad" : "#226288", sans);
                ctx.restore();
            }); };
            var vendingStatus = art(96, 32, function () {
            });
            var vendingStatusContext = vendingStatus.image.getContext("2d");
            var displayedState = -1;
            function updateShops(seconds) {
                var state = Math.floor(seconds * 2) % 2;
                if (state === displayedState)
                    return;
                displayedState = state;
                vendingStatusContext.fillStyle = "#272e2a";
                vendingStatusContext.fillRect(0, 0, 96, 32);
                words(vendingStatusContext, state ? "\xA5 120" : "120", 48, 16, 20, "#ffc474", "monospace");
                vendingStatus.needsUpdate = true;
            }
            updateShops(0);
            storefront = vending;
            for (var i = 0; i < 2; i++) {
                var x = 3.35 + i * 1.18;
                var z = -2.06 - i * 0.074;
                var shell = i ? paleEnamel : skyEnamel;
                var accent = i ? lacquer : skyEnamel;
                box2(x, 1.26, z, 1.09, 2.1, 0.78, shell);
                box2(x, 0.225, z, 0.97, 0.09, 0.65, iron);
                box2(x, 2.329, z, 1.074, 0.092, 0.754, shell);
                box2(x, 1.571, z + 0.398, 0.948, 1.072, 0.033, iron);
                var windowFace = billboard(display(i), x, 1.571, z + 0.416, 0.898, 1.023, 1.12);
                windowFace.name = "Vending showcase canvas";
                billboard(machineBrand(i), x, 2.212, z + 0.395, 0.932, 0.239, 0.42);
                billboard(canTexture(i), x - 0.257, 0.742, z + 0.394, 0.465, 0.547, 0.03);
                box2(x + 0.248, 0.877, z + 0.402, 0.184, 0.243, 0.058, iron);
                box2(x + 0.248, 0.932, z + 0.436, 0.108, 0.039, 0.012, glass, false);
                billboard(vendingStatus, x + 0.248, 0.931, z + 0.444, 0.096, 0.03, 0.95);
                box2(x + 0.26, 0.855, z + 0.439, 0.067, 0.019, 0.018, paleEnamel, false);
                box2(x + 0.239, 0.779, z + 0.436, 0.028, 0.032, 0.015, amber, false);
                box2(x + 0.012, 0.487, z + 0.416, 0.64, 0.19, 0.041, iron);
                box2(x + 0.012, 0.469, z + 0.442, 0.569, 0.11, 0.014, darkRecess, false);
                box2(x + 0.012, 0.405, z + 0.44, 0.672, 0.027, 0.065, accent);
                var sideGraphic = billboard(machineBrand(i), x + 0.547, 1.52, z, 0.55, 0.15, 0.12);
                sideGraphic.rotation.y = Math.PI / 2;
                for (var j = 0; j < 6; j++)
                    box2(x + 0.546, 0.386 + j * 0.048, z + 0.04, 7e-3, 0.013, 0.37, iron, false);
            }
            var vendingLight = new THREE.PointLight(6804457, 6.8, 4.35, 2);
            vendingLight.position.set(3.38, 0.95, -0.89);
            vending.add(vendingLight);
            lightPaint2.add(vending, [3.25, 0.183, -0.69], [1.44, 1.54], "#91dfeb", 0.31, true);
            var bin = paint(7704460, { roughness: 0.48 });
            box2(5.39, 0.534, -1.876, 0.54, 0.702, 0.48, bin);
            box2(5.39, 0.883, -1.876, 0.566, 0.085, 0.504, slate);
            [5.26, 5.52].forEach(function (x) {
                var opening = tube2(x, 0.928, -1.854, 0.073, 0.073, 0.013, darkRecess, 16);
                opening.castShadow = false;
            });
            var recycle = art(256, 128, function (ctx, w, h) {
                ctx.fillStyle = "#d7daaf";
                ctx.fillRect(0, 0, w, h);
                words(ctx, "\u7F36\u30FB\u3073\u3093", w / 2, h / 2, 49, "#36534f", sans);
            });
            billboard(recycle, 5.39, 0.727, -1.631, 0.39, 0.166, 0.08);
            try {
                for (var _k = __values([ramen, vending]), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var corner = _l.value;
                    var boxBatches = new Map();
                    try {
                        for (var _m = (e_177 = void 0, __values(corner.children)), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var part = _o.value;
                            if (part.geometry !== cube)
                                continue;
                            var key = "".concat(part.material.id, "/").concat(part.castShadow);
                            if (!boxBatches.has(key))
                                boxBatches.set(key, []);
                            boxBatches.get(key).push(part);
                        }
                    }
                    catch (e_177_1) { e_177 = { error: e_177_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_f = _m.return)) _f.call(_m);
                        }
                        finally { if (e_177) throw e_177.error; }
                    }
                    var _loop_14 = function (parts) {
                        if (parts.length < 2)
                            return "continue";
                        var batch = new THREE.InstancedMesh(cube, parts[0].material, parts.length);
                        batch.castShadow = parts[0].castShadow;
                        batch.receiveShadow = true;
                        parts.forEach(function (part, index) {
                            part.updateMatrix();
                            batch.setMatrixAt(index, part.matrix);
                            part.removeFromParent();
                        });
                        corner.add(batch);
                    };
                    try {
                        for (var _p = (e_178 = void 0, __values(boxBatches.values())), _q = _p.next(); !_q.done; _q = _p.next()) {
                            var parts = _q.value;
                            _loop_14(parts);
                        }
                    }
                    catch (e_178_1) { e_178 = { error: e_178_1 }; }
                    finally {
                        try {
                            if (_q && !_q.done && (_g = _p.return)) _g.call(_p);
                        }
                        finally { if (e_178) throw e_178.error; }
                    }
                }
            }
            catch (e_176_1) { e_176 = { error: e_176_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                }
                finally { if (e_176) throw e_176.error; }
            }
            return updateShops;
        }
        function buildTsukiakariStore(installation, lightPaint2) {
            var e_179, _d, e_180, _e, e_181, _f, e_182, _g, e_183, _h, e_184, _j, e_185, _k, e_186, _l, e_187, _m, e_188, _o, e_189, _p, e_190, _q, e_191, _r, e_192, _s, e_193, _t, e_194, _u, e_195, _v, e_196, _w, e_197, _x, e_198, _y, e_199, _z, e_200, _0, e_201, _1, e_202, _2, e_203, _3, e_204, _4, e_205, _5, e_206, _6, e_207, _7, e_208, _8, e_209, _9;
            var T = THREE, pi = Math.PI;
            var v = function (x, y, z) { return new T.Vector3(x, y, z); };
            var rand = randomFrom(417831);
            var choose = function (values) { return values[Math.floor(rand() * values.length)]; };
            var cache = new Map();
            var asset = new T.Group();
            asset.name = "Original convenience store model";
            var shop = new T.Group();
            shop.name = "\u6708\u706F\u30DE\u30FC\u30C8 \xB7 Tsukiakari Mart";
            asset.add(shop);
            var boxGeo = new T.BoxGeometry();
            var cylGeo = new T.CylinderGeometry(1, 1, 1, 12);
            var planeGeo = new T.PlaneGeometry();
            var uv = planeGeo.getAttribute("uv");
            for (var i = 0; i < uv.count; i++)
                uv.setX(i, 1 - uv.getX(i));
            var teal = "#388379";
            function paint(color) {
                if (!cache.has(color))
                    cache.set(color, new T.MeshStandardMaterial({ color: color, roughness: 0.78 }));
                return cache.get(color);
            }
            var lit = function (color) {
                var key = "lamp:" + color;
                if (!cache.has(key))
                    cache.set(key, new T.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.63, roughness: 0.63 }));
                return cache.get(key);
            };
            var warm = lit("#fff0cc");
            warm.emissiveIntensity = 1.23;
            function mesh(parent, geo, material2, x, y, z) {
                var result = new T.Mesh(geo, typeof material2 === "string" ? paint(material2) : material2);
                result.position.set(x, y, z);
                result.receiveShadow = !result.material.transparent;
                parent.add(result);
                return result;
            }
            function box2(parent, x, y, z, w, h, d, material2, structural) {
                if (structural === void 0) { structural = false; }
                var result = mesh(parent, boxGeo, material2, x, y, z);
                result.scale.set(w, h, d);
                result.castShadow = structural;
                return result;
            }
            function cyl(parent, x, y, z, radius, h, material2) {
                var result = mesh(parent, cylGeo, material2, x, y, z);
                result.scale.set(radius, h, radius);
                return result;
            }
            function tube2(parent, a, b, radius, material2) {
                var result = cyl(parent, 0, 0, 0, radius, a.distanceTo(b), material2);
                result.position.copy(a).lerp(b, 0.5);
                result.quaternion.setFromUnitVectors(v(0, 1, 0), b.clone().sub(a).normalize());
                return result;
            }
            function group(parent, x, y, z, yaw) {
                if (yaw === void 0) { yaw = 0; }
                var result = new T.Group();
                result.position.set(x, y, z);
                result.rotation.y = yaw;
                parent.add(result);
                return result;
            }
            function surface(parent, x, y, z, w, h, material2, yaw) {
                if (yaw === void 0) { yaw = 0; }
                var result = mesh(parent, planeGeo, material2, x, y, z);
                result.scale.set(w, h, 1);
                result.rotation.y = yaw;
                if (material2.transparent)
                    result.renderOrder = 1;
                return result;
            }
            function ground(parent, x, y, z, w, d, material2, yaw) {
                if (yaw === void 0) { yaw = 0; }
                var result = surface(parent, x, y, z, w, d, material2);
                result.rotation.set(-pi / 2, 0, yaw);
                return result;
            }
            function signTexture(width, height, draw) {
                var map = paintedTexture(width, height, draw);
                return new T.MeshStandardMaterial({
                    map: map,
                    roughness: 0.82,
                    emissiveMap: map,
                    emissive: 16777215,
                    emissiveIntensity: 0.1,
                    alphaTest: 0.06
                });
            }
            function type(c, label, x, y, size, color, weight, align) {
                if (weight === void 0) { weight = 700; }
                if (align === void 0) { align = "left"; }
                c.fillStyle = color;
                c.font = weight + " " + size + 'px "Yu Gothic", "Meiryo", "Noto Sans CJK JP", sans-serif';
                c.textAlign = align;
                c.textBaseline = "alphabetic";
                c.fillText(label, x, y);
            }
            function rect(c, color, x, y, w, h) {
                c.fillStyle = color;
                c.fillRect(x, y, w, h);
            }
            function crescent(c, x, y, r, color, cut) {
                c.beginPath();
                c.arc(x, y, r, 0, pi * 2);
                c.fillStyle = color;
                c.fill();
                c.beginPath();
                c.arc(x + r * 0.44, y - r * 0.32, r * 0.88, 0, pi * 2);
                c.fillStyle = cut;
                c.fill();
            }
            var W = 8.24, D = 6.08, F = 3.04, R = 4.12;
            var wall = "#a29883", framing = "#43676c";
            box2(shop, 0, 0.036, 0, W, 0.069, D, "#e9c6a2", true);
            var tileMaterial = signTexture(512, 512, function (c) {
                rect(c, "#dfbd97", 0, 0, 512, 512);
                for (var j = 0; j < 12; j++)
                    for (var i = 0; i < 16; i++) {
                        rect(c, choose(["#edcba4", "#f3d5af", "#efd3ac", "#e9c7a1", "#f1d1a7"]), 32 * i + 1.1, j * 42.67 + 1, 30, 40.5);
                    }
            });
            ground(shop, 0, 0.073, 0, W - 0.14, D - 0.12, tileMaterial);
            box2(shop, 0, 1.53, -F + 0.08, W, 2.94, 0.17, wall, true);
            box2(shop, -R + 0.08, 1.53, 0, 0.16, 2.95, D, wall, true);
            box2(shop, 0, 0.26, -F + 0.17, 8.02, 0.38, 0.02, "#8ca89a");
            box2(shop, -R + 0.17, 0.26, 0, 0.02, 0.38, 5.89, "#8ca89a");
            box2(shop, 0, 2.87, 0.01, 8.06, 0.096, 5.97, "#e5c8a5");
            try {
                for (var _10 = __values([-2.98, -0.15, 2.62]), _11 = _10.next(); !_11.done; _11 = _10.next()) {
                    var x = _11.value;
                    try {
                        for (var _12 = (e_180 = void 0, __values([-1.53, 0.48, 2.28])), _13 = _12.next(); !_13.done; _13 = _12.next()) {
                            var z = _13.value;
                            box2(shop, x, 2.812, z, 1.82, 0.053, 0.105, "#c6ac93");
                            box2(shop, x, 2.779, z, 1.76, 0.018, 0.083, warm);
                        }
                    }
                    catch (e_180_1) { e_180 = { error: e_180_1 }; }
                    finally {
                        try {
                            if (_13 && !_13.done && (_e = _12.return)) _e.call(_12);
                        }
                        finally { if (e_180) throw e_180.error; }
                    }
                }
            }
            catch (e_179_1) { e_179 = { error: e_179_1 }; }
            finally {
                try {
                    if (_11 && !_11.done && (_d = _10.return)) _d.call(_10);
                }
                finally { if (e_179) throw e_179.error; }
            }
            try {
                for (var _14 = __values([-4.045, -1.38, 0.87, 4.04]), _15 = _14.next(); !_15.done; _15 = _14.next()) {
                    var x = _15.value;
                    box2(shop, x, 1.36, 3.03, 0.12, 2.66, 0.17, framing, true);
                    box2(shop, x + 0.037, 1.37, 3.122, 0.02, 2.63, 0.02, "#bad0bc");
                }
            }
            catch (e_181_1) { e_181 = { error: e_181_1 }; }
            finally {
                try {
                    if (_15 && !_15.done && (_f = _14.return)) _f.call(_14);
                }
                finally { if (e_181) throw e_181.error; }
            }
            box2(shop, -2.71, 1.31, 3.025, 0.05, 2.59, 0.075, framing, true);
            box2(shop, 2.47, 1.31, 3.025, 0.057, 2.59, 0.075, framing, true);
            box2(shop, 0, 2.57, 3.04, 8.19, 0.082, 0.15, framing, true);
            try {
                for (var _16 = __values([[-2.74, 2.71], [2.49, 3.24]]), _17 = _16.next(); !_17.done; _17 = _16.next()) {
                    var _18 = __read(_17.value, 2), x = _18[0], width = _18[1];
                    box2(shop, x, 0.2, 3.04, width, 0.082, 0.15, framing, true);
                }
            }
            catch (e_182_1) { e_182 = { error: e_182_1 }; }
            finally {
                try {
                    if (_17 && !_17.done && (_g = _16.return)) _g.call(_16);
                }
                finally { if (e_182) throw e_182.error; }
            }
            try {
                for (var _19 = __values([[-2.71, 2.52], [2.47, 3.09]]), _20 = _19.next(); !_20.done; _20 = _19.next()) {
                    var _21 = __read(_20.value, 2), x = _21[0], width = _21[1];
                    box2(shop, x, 0.156, 3.068, width, 0.165, 0.089, "#849b8e");
                    box2(shop, x, 0.625, 3.035, width, 0.024, 0.065, "#72958c");
                }
            }
            catch (e_183_1) { e_183 = { error: e_183_1 }; }
            finally {
                try {
                    if (_20 && !_20.done && (_h = _19.return)) _h.call(_19);
                }
                finally { if (e_183) throw e_183.error; }
            }
            try {
                for (var _22 = __values([-2.94, -2.03, -0.36, 1.33, 2.98]), _23 = _22.next(); !_23.done; _23 = _22.next()) {
                    var z = _23.value;
                    box2(shop, 4.073, 1.32, z, 0.132, 2.61, 0.097, framing, true);
                    box2(shop, 4.148, 1.33, z, 0.015, 2.58, 0.021, "#a6c2b5");
                }
            }
            catch (e_184_1) { e_184 = { error: e_184_1 }; }
            finally {
                try {
                    if (_23 && !_23.done && (_j = _22.return)) _j.call(_22);
                }
                finally { if (e_184) throw e_184.error; }
            }
            try {
                for (var _24 = __values([0.18, 0.625, 2.57]), _25 = _24.next(); !_25.done; _25 = _24.next()) {
                    var y = _25.value;
                    box2(shop, 4.073, y, 0, 0.133, y === 0.625 ? 0.024 : 0.074, 6, framing, true);
                }
            }
            catch (e_185_1) { e_185 = { error: e_185_1 }; }
            finally {
                try {
                    if (_25 && !_25.done && (_k = _24.return)) _k.call(_24);
                }
                finally { if (e_185) throw e_185.error; }
            }
            box2(shop, 4.076, 0.18, 0, 0.132, 0.22, 6.02, "#7b9389", true);
            box2(shop, 0, 2.715, 3.055, 8.36, 0.25, 0.2, "#d0c0a3", true);
            box2(shop, 4.096, 2.715, -0.02, 0.21, 0.25, 6.16, "#c2b79d", true);
            var glassMat = new T.MeshPhysicalMaterial({
                color: "#a9c8c5",
                roughness: 0.2,
                metalness: 0.08,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                side: T.DoubleSide,
                envMapIntensity: 0.72,
                clearcoat: 0.28,
                clearcoatRoughness: 0.18
            });
            var glassMarks = signTexture(512, 512, function (c) {
                var e_210, _d;
                c.fillStyle = "#d5f6fc19";
                try {
                    for (var _e = __values([[0, 232, 198, 27], [216, 110, 60, 17], [302, 380, 104, 24]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 4), x = _g[0], y = _g[1], w = _g[2], h = _g[3];
                        c.beginPath();
                        c.moveTo(x, y);
                        c.lineTo(x + w, y - 104);
                        c.lineTo(x + w + h, y - 104);
                        c.lineTo(x + h, y);
                        c.closePath();
                        c.fill();
                    }
                }
                catch (e_210_1) { e_210 = { error: e_210_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_210) throw e_210.error; }
                }
            });
            glassMarks.depthWrite = false;
            glassMarks.transparent = true;
            glassMarks.opacity = 0.3;
            glassMarks.side = T.DoubleSide;
            function windowPane(parent, x, y, z, w, h, yaw) {
                if (yaw === void 0) { yaw = 0; }
                surface(parent, x, y, z, w, h, glassMat, yaw);
                surface(parent, x + 9e-3 * Math.sin(yaw), y, z + 9e-3 * Math.cos(yaw), w, h, glassMarks, yaw).renderOrder = 2;
            }
            var glazing = group(shop, 0, 0, 0);
            try {
                for (var _26 = __values([[-3.37, 1.25], [-2.04, 1.23], [1.68, 1.53], [3.25, 1.52]]), _27 = _26.next(); !_27.done; _27 = _26.next()) {
                    var _28 = __read(_27.value, 2), x = _28[0], w = _28[1];
                    windowPane(glazing, x, 1.39, 3.039, w, 2.35);
                }
            }
            catch (e_186_1) { e_186 = { error: e_186_1 }; }
            finally {
                try {
                    if (_27 && !_27.done && (_l = _26.return)) _l.call(_26);
                }
                finally { if (e_186) throw e_186.error; }
            }
            try {
                for (var _29 = __values([[-2.48, 0.83], [-1.195, 1.62], [0.485, 1.63], [2.155, 1.62]]), _30 = _29.next(); !_30.done; _30 = _29.next()) {
                    var _31 = __read(_30.value, 2), z = _31[0], w = _31[1];
                    windowPane(glazing, 4.083, 1.39, z, w, 2.35, pi / 2);
                }
            }
            catch (e_187_1) { e_187 = { error: e_187_1 }; }
            finally {
                try {
                    if (_30 && !_30.done && (_m = _29.return)) _m.call(_29);
                }
                finally { if (e_187) throw e_187.error; }
            }
            var doors = [group(glazing, -0.79, 0, 3.112), group(glazing, 0.295, 0, 3.112)];
            var doorLabel = signTexture(384, 128, function (c) {
                rect(c, "#dfe5d7", 0, 0, 384, 128);
                rect(c, "#347969", 0, 0, 384, 18);
                type(c, "\u81EA\u52D5\u30C9\u30A2", 192, 92, 66, "#296251", 700, "center");
            });
            doors.forEach(function (door, i) {
                var e_211, _d;
                box2(door, 0, 0.144, 0, 1.075, 0.124, 0.046, framing);
                box2(door, 0, 2.466, 0, 1.075, 0.084, 0.049, framing);
                try {
                    for (var _e = __values([-0.522, 0.522]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var x = _f.value;
                        box2(door, x, 1.306, 0, 0.041, 2.38, 0.05, framing);
                    }
                }
                catch (e_211_1) { e_211 = { error: e_211_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_211) throw e_211.error; }
                }
                windowPane(door, 0, 1.304, 0.012, 1.02, 2.28);
                surface(door, i === 0 ? 0.29 : -0.29, 1.14, 0.031, 0.36, 0.12, doorLabel);
                box2(door, i === 0 ? 0.47 : -0.47, 1.24, 0.036, 0.046, 0.26, 0.037, "#c2cec1");
            });
            box2(shop, -0.25, 2.51, 3.19, 2.31, 0.16, 0.142, "#4e6465", true);
            box2(shop, -0.25, 2.49, 3.27, 0.29, 0.059, 0.056, "#273640");
            box2(shop, -0.25, 0.085, 3.08, 2.18, 0.041, 0.184, "#b9a895", true);
            var matDecal = signTexture(384, 164, function (c) {
                rect(c, "#254c50", 0, 0, 384, 164);
                rect(c, "#4d786f", 5, 5, 374, 154);
                rect(c, "#284b4b", 9, 9, 366, 146);
                for (var i = 0; i < 43; i++)
                    rect(c, "#63877b35", i * 9, 0, 2, 164);
                crescent(c, 147, 79, 26, "#bcae83", "#284b4b");
                type(c, "\u6708\u706F", 195, 97, 41, "#c3b48c");
            });
            box2(shop, -0.25, 0.052, 3.176, 2.3, 0.104, 0.247, "#baa995");
            ground(shop, -0.25, 0.108, 3.176, 2.14, 0.244, matDecal);
            var band = group(shop, 0, 3.019, 3.2);
            box2(band, 0, 4e-3, 0.03, 8.66, 0.53, 0.21, "#d7c6a6", true);
            box2(band, 0, -0.225, 0.162, 8.64, 0.08, 0.036, lit("#e67660"));
            box2(band, 0, -0.142, 0.159, 8.64, 0.048, 0.034, lit("#65ccb6"));
            var fasciaSide = group(shop, 4.249, 3.019, -2e-3, pi / 2);
            box2(fasciaSide, 0, 4e-3, 0.025, 6.49, 0.53, 0.2, "#cfbea1", true);
            box2(fasciaSide, 0, -0.225, 0.154, 6.49, 0.08, 0.036, lit("#e67660"));
            box2(fasciaSide, 0, -0.142, 0.153, 6.49, 0.048, 0.034, lit("#65ccb6"));
            var signMain = signTexture(1536, 228, function (c, w, h) {
                rect(c, "#ecdfbf", 0, 0, w, h);
                rect(c, "#fff2d1", 5, 5, w - 10, h - 10);
                rect(c, "#214d50", 10, 10, 229, h - 20);
                crescent(c, 116, 112, 68, "#edc782", "#214d50");
                c.beginPath();
                c.moveTo(158, 48);
                c.lineTo(168, 74);
                c.lineTo(193, 84);
                c.lineTo(168, 92);
                c.lineTo(158, 118);
                c.lineTo(149, 92);
                c.lineTo(124, 84);
                c.lineTo(149, 74);
                c.closePath();
                c.fillStyle = "#87ead3";
                c.fill();
                type(c, "\u6708\u706F\u30DE\u30FC\u30C8", 278, 136, 110, "#204446", 800);
                type(c, "T S U K I A K A R I   M A R T", 289, 191, 31, "#487675", 700);
                rect(c, "#2e5957", 1247, 32, 250, 155);
                rect(c, "#7fd9c1", 1247, 32, 250, 9);
                type(c, "24H", 1372, 126, 78, "#f9e9bb", 800, "center");
                type(c, "\u5E74\u4E2D\u7121\u4F11", 1372, 163, 25, "#b3dac1", 700, "center");
            });
            signMain.emissiveIntensity = 0.5;
            surface(band, -0.24, 0.053, 0.15, 6.58, 0.408, signMain);
            surface(fasciaSide, 0.22, 0.055, 0.143, 4.95, 0.41, signMain);
            box2(shop, 0, 2.761, 3.323, 8.79, 0.087, 0.668, "#314c59", true);
            box2(shop, 0, 2.743, 3.528, 8.79, 0.038, 0.271, "#698e8b");
            box2(shop, 4.29, 2.765, -0.04, 0.555, 0.083, 6.35, "#3b5560", true);
            try {
                for (var _32 = __values([-3.26, -1.33, 0.6, 2.61]), _33 = _32.next(); !_33.done; _33 = _32.next()) {
                    var x = _33.value;
                    box2(shop, x, 2.708, 3.297, 1.32, 0.018, 0.076, warm);
                }
            }
            catch (e_188_1) { e_188 = { error: e_188_1 }; }
            finally {
                try {
                    if (_33 && !_33.done && (_o = _32.return)) _o.call(_32);
                }
                finally { if (e_188) throw e_188.error; }
            }
            try {
                for (var _34 = __values([-1.9, -0.03, 1.82]), _35 = _34.next(); !_35.done; _35 = _34.next()) {
                    var z = _35.value;
                    box2(shop, 4.31, 2.713, z, 0.067, 0.018, 1.14, warm);
                }
            }
            catch (e_189_1) { e_189 = { error: e_189_1 }; }
            finally {
                try {
                    if (_35 && !_35.done && (_p = _34.return)) _p.call(_34);
                }
                finally { if (e_189) throw e_189.error; }
            }
            box2(shop, 0.06, 3.18, 9e-3, 8.76, 0.286, 6.65, "#526a75", true);
            box2(shop, 0.06, 3.337, 0.014, 8.86, 0.085, 6.76, "#759092", true);
            box2(shop, 0.06, 3.386, -0.017, 8.57, 0.039, 6.47, "#5d737f");
            var parapet = "#597481";
            try {
                for (var _36 = __values([-3.298, 3.3]), _37 = _36.next(); !_37.done; _37 = _36.next()) {
                    var z = _37.value;
                    box2(shop, 0.06, 3.454, z, 8.73, 0.156, 0.132, parapet, true);
                    box2(shop, 0.06, 3.547, z, 8.78, 0.038, 0.164, "#829c9e", true);
                }
            }
            catch (e_190_1) { e_190 = { error: e_190_1 }; }
            finally {
                try {
                    if (_37 && !_37.done && (_q = _36.return)) _q.call(_36);
                }
                finally { if (e_190) throw e_190.error; }
            }
            try {
                for (var _38 = __values([-4.245, 4.367]), _39 = _38.next(); !_39.done; _39 = _38.next()) {
                    var x = _39.value;
                    box2(shop, x, 3.454, 3e-3, 0.132, 0.156, 6.56, parapet, true);
                    box2(shop, x, 3.547, 3e-3, 0.168, 0.038, 6.54, "#829c9e", true);
                }
            }
            catch (e_191_1) { e_191 = { error: e_191_1 }; }
            finally {
                try {
                    if (_39 && !_39.done && (_r = _38.return)) _r.call(_38);
                }
                finally { if (e_191) throw e_191.error; }
            }
            var roofing = signTexture(1024, 768, function (c, w, h) {
                rect(c, "#506575", 0, 0, w, h);
                for (var i = 0; i < 6300; i++) {
                    rect(c, choose(["#8da4ad31", "#263d502b", "#aec3c330", "#455c6729"]), rand() * w, rand() * h, 1 + rand() * 16, 1 + rand() * 2);
                }
                for (var i = 0; i < 12; i++) {
                    rect(c, "#394f5b", i * 93, 0, 1, h);
                    rect(c, "#778c96", i * 93 + 1, 0, 2, h);
                }
            });
            ground(shop, 0.06, 3.409, -0.013, 8.47, 6.44, roofing);
            try {
                for (var _40 = __values([-3.8, 4.17]), _41 = _40.next(); !_41.done; _41 = _40.next()) {
                    var x = _41.value;
                    tube2(shop, v(x, 3.38, 3.25), v(x, 3.17, 3.53), 0.043, "#708c90");
                    tube2(shop, v(x, 3.2, 3.49), v(x, 2.73, 3.49), 0.043, "#708c90");
                }
            }
            catch (e_192_1) { e_192 = { error: e_192_1 }; }
            finally {
                try {
                    if (_41 && !_41.done && (_s = _40.return)) _s.call(_40);
                }
                finally { if (e_192) throw e_192.error; }
            }
            box2(shop, -4.219, 1.52, 2.72, 0.064, 2.98, 0.079, "#405965", true);
            box2(shop, 4.242, 1.51, -2.92, 0.062, 2.91, 0.079, "#506c75", true);
            function labelMaterial(large, small, background, fg) {
                if (background === void 0) { background = "#285e59"; }
                if (fg === void 0) { fg = "#fff1cf"; }
                return signTexture(512, 136, function (c) {
                    rect(c, background, 0, 0, 512, 136);
                    type(c, large, 24, 78, 56, fg, 750);
                    type(c, small, 27, 115, 23, fg, 600);
                    rect(c, "#ffffff26", 0, 0, 512, 8);
                });
            }
            var sectionLabels = {
                drinks: labelMaterial("\u51B7\u305F\u3044\u98F2\u307F\u7269", "COLD DRINKS"),
                deli: labelMaterial("\u304A\u5F01\u5F53", "BENTO & DELI", "#a35244"),
                rice: labelMaterial("\u304A\u306B\u304E\u308A", "RICE BALLS", "#557859"),
                snacks: labelMaterial("\u304A\u83D3\u5B50", "SWEETS & SNACKS", "#b9704b"),
                register: labelMaterial("\u304A\u4F1A\u8A08", "CHECKOUT", "#3b7870"),
                oden: labelMaterial("\u304A\u3067\u3093", "\u3042\u305F\u305F\u304B\u3044 \u304A\u3060\u3057", "#b55a45"),
                coffee: labelMaterial("\u6708\u706F\u73C8\u7432", "HOT COFFEE", "#563c38")
            };
            var snackColors = ["#d77964", "#7ba58a", "#e9aa69", "#d28e99", "#e1b963", "#8fa9b0", "#a19c82", "#c9ae79"];
            var wrappers = ["#fff0cd", "#f7e4bb", "#ecddbb", "#f5e6ca"];
            function packet(parent, x, y, z, w, h, d, color, angle) {
                if (angle === void 0) { angle = 0; }
                var p = group(parent, x, y, z, angle);
                box2(p, 0, h / 2, 0, w, h, d, color);
                box2(p, 0, h * 0.46, d * 0.511, w * 0.79, h * 0.32, 6e-3, choose(wrappers));
                box2(p, 0, h * 0.91, d * 0.511, w * 0.9, h * 0.045, 6e-3, "#f8e5c2");
                return p;
            }
            function bottle(parent, x, y, z, color, scale) {
                if (scale === void 0) { scale = 1; }
                cyl(parent, x, y + 0.099 * scale, z, 0.055 * scale, 0.196 * scale, color);
                cyl(parent, x, y + 0.098 * scale, z, 0.0568 * scale, 0.073 * scale, choose(wrappers));
                cyl(parent, x, y + 0.21 * scale, z, 0.034 * scale, 0.046 * scale, color);
                cyl(parent, x, y + 0.236 * scale, z, 0.038 * scale, 0.018 * scale, "#e1d6bb");
            }
            var riceGeo = new T.CylinderGeometry(0.118, 0.118, 0.105, 3);
            function riceball(parent, x, y, z, color) {
                var m = mesh(parent, riceGeo, "#f2e3bb", x, y + 0.113, z);
                m.rotation.x = pi / 2;
                box2(parent, x, y + 0.074, z + 0.055, 0.078, 0.099, 0.01, "#52614a");
                box2(parent, x + 0.027, y + 0.145, z + 0.055, 0.046, 0.032, 9e-3, color);
            }
            function bento(parent, x, y, z, width) {
                if (width === void 0) { width = 0.32; }
                box2(parent, x, y + 0.032, z, width, 0.061, 0.201, "#705343");
                box2(parent, x, y + 0.068, z, width * 0.91, 0.021, 0.188, "#e3c99f");
                box2(parent, x - width * 0.22, y + 0.085, z, width * 0.36, 0.014, 0.145, "#f9e7c0");
                box2(parent, x + width * 0.2, y + 0.087, z + 0.019, width * 0.34, 0.022, 0.087, choose(snackColors));
                box2(parent, x + width * 0.19, y + 0.088, z - 0.055, width * 0.29, 0.021, 0.044, "#8d985e");
                box2(parent, x + width * 0.29, y + 0.099, z + 0.053, width * 0.2, 7e-3, 0.046, "#f3e2bd");
            }
            function gondola(x, z, width, title, style) {
                var e_212, _d, e_213, _e;
                var g = group(shop, x, 0, z);
                box2(g, 0, 0.774, 0, width, 1.37, 0.082, "#9a9e80", true);
                box2(g, 0, 0.16, 0.05, width + 0.08, 0.16, 0.85, "#a69a7d", true);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        box2(g, width * 0.5 * side, 0.784, 0.16, 0.076, 1.31, 0.58, "#c5ac8f", true);
                    }
                }
                catch (e_212_1) { e_212 = { error: e_212_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_212) throw e_212.error; }
                }
                try {
                    for (var _h = __values([0.29, 0.59, 0.89, 1.19].entries()), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var _k = __read(_j.value, 2), row = _k[0], y = _k[1];
                        box2(g, 0, y, 0.061, width, 0.049, 0.77, "#e0c7a4", true);
                        box2(g, 0, y + 0.015, 0.454, width, 0.042, 0.025, "#e7d5b5");
                        for (var j = 0; j < Math.floor(width / 0.215); j++) {
                            var x2 = -width / 2 + 0.146 + j * 0.21;
                            var col = snackColors[(j + row * 3) % snackColors.length];
                            if (style === "rice" && row < 3) {
                                riceball(g, x2, y + 0.035, 0.292, col);
                                if (j % 2 === 0)
                                    riceball(g, x2, y + 0.031, 0.141, col);
                            }
                            else {
                                packet(g, x2, y + 0.029, 0.266, 0.121 + rand() * 0.055, 0.145 + rand() * 0.084, 0.105, col, rand() * 0.13 - 0.065);
                                packet(g, x2, y + 0.029, 0.107, 0.137, 0.162 + rand() * 0.073, 0.091, col);
                            }
                            box2(g, x2, y + 0.012, 0.468, 0.086, 0.024, 6e-3, "#f9ead4");
                        }
                    }
                }
                catch (e_213_1) { e_213 = { error: e_213_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_213) throw e_213.error; }
                }
                box2(g, 0, 1.475, 0.055, width + 0.11, 0.071, 0.53, "#e6c8a1", true);
                surface(g, -width * 0.29, 1.489, 0.333, 0.87, 0.191, title);
                return g;
            }
            gondola(0.11, -0.4, 3.32, sectionLabels.rice, "rice");
            gondola(0.03, -1.56, 3.28, sectionLabels.snacks, "snack");
            var fridges = group(shop, 1.42, 0, -2.54);
            box2(fridges, 0, 1.223, -0.137, 4.6, 2.29, 0.52, "#718485", true);
            box2(fridges, 0, 1.25, 0.133, 4.5, 1.96, 0.036, "#cbdbc0");
            box2(fridges, 0, 2.302, 0.153, 4.63, 0.236, 0.18, "#748b81", true);
            surface(fridges, -1.21, 2.316, 0.246, 1.48, 0.197, sectionLabels.drinks);
            box2(fridges, 0.77, 2.319, 0.247, 2.11, 0.124, 0.016, lit("#e6f7d7"));
            try {
                for (var _42 = __values([0.31, 0.666, 1.014, 1.366, 1.727]), _43 = _42.next(); !_43.done; _43 = _42.next()) {
                    var y = _43.value;
                    box2(fridges, 0, y, 0.229, 4.49, 0.042, 0.239, "#b9bfb1");
                    box2(fridges, 0, y + 0.013, 0.357, 4.47, 0.036, 0.024, "#f0dcc1");
                    for (var j = 0; j < 28; j++) {
                        var x = -2.14 + j * 0.158;
                        var shade = choose(["#749c68", "#ce926b", "#ba6e5b", "#d0ad62", "#9bb7ad", "#6c9a9f", "#dcbd90"]);
                        if (j % 7 < 3)
                            bottle(fridges, x, y + 0.032, 0.277, shade, 0.8 + rand() * 0.24);
                        else
                            packet(fridges, x, y + 0.03, 0.283, 0.1, 0.137 + rand() * 0.083, 0.095, shade);
                    }
                }
            }
            catch (e_193_1) { e_193 = { error: e_193_1 }; }
            finally {
                try {
                    if (_43 && !_43.done && (_t = _42.return)) _t.call(_42);
                }
                finally { if (e_193) throw e_193.error; }
            }
            try {
                for (var _44 = __values([-2.28, -1.14, 0, 1.14, 2.28]), _45 = _44.next(); !_45.done; _45 = _44.next()) {
                    var x = _45.value;
                    box2(fridges, x, 1.19, 0.381, 0.047, 2.12, 0.046, "#5e7678", true);
                    if (x > -2)
                        box2(fridges, x - 0.08, 1.21, 0.408, 0.036, 0.28, 0.035, "#d6e3d1");
                }
            }
            catch (e_194_1) { e_194 = { error: e_194_1 }; }
            finally {
                try {
                    if (_45 && !_45.done && (_u = _44.return)) _u.call(_44);
                }
                finally { if (e_194) throw e_194.error; }
            }
            try {
                for (var _46 = __values([-1.71, -0.57, 0.57, 1.71]), _47 = _46.next(); !_47.done; _47 = _46.next()) {
                    var x = _47.value;
                    surface(fridges, x, 1.198, 0.383, 1.09, 1.83, glassMat);
                    box2(fridges, x - 0.514, 1.2, 0.386, 0.013, 1.89, 0.01, lit("#d7f6df"));
                }
            }
            catch (e_195_1) { e_195 = { error: e_195_1 }; }
            finally {
                try {
                    if (_47 && !_47.done && (_v = _46.return)) _v.call(_46);
                }
                finally { if (e_195) throw e_195.error; }
            }
            box2(fridges, 0, 0.199, 0.265, 4.6, 0.21, 0.232, "#526b72", true);
            var deli = group(shop, 2.64, 0, 0.94, -0.12);
            box2(deli, 0, 0.377, 0, 1.58, 0.59, 1.12, "#b7a486", true);
            box2(deli, 0, 0.702, 0.015, 1.62, 0.075, 1.18, "#e7cfad", true);
            box2(deli, 0, 0.952, -0.38, 1.58, 0.074, 0.29, "#e7cfad", true);
            try {
                for (var _48 = __values([-0.59, -0.21, 0.19, 0.58]), _49 = _48.next(); !_49.done; _49 = _48.next()) {
                    var x = _49.value;
                    try {
                        for (var _50 = (e_197 = void 0, __values([-0.14, 0.14, 0.41])), _51 = _50.next(); !_51.done; _51 = _50.next()) {
                            var z = _51.value;
                            bento(deli, x, 0.739, z, 0.33);
                        }
                    }
                    catch (e_197_1) { e_197 = { error: e_197_1 }; }
                    finally {
                        try {
                            if (_51 && !_51.done && (_x = _50.return)) _x.call(_50);
                        }
                        finally { if (e_197) throw e_197.error; }
                    }
                    bento(deli, x, 0.994, -0.38, 0.33);
                }
            }
            catch (e_196_1) { e_196 = { error: e_196_1 }; }
            finally {
                try {
                    if (_49 && !_49.done && (_w = _48.return)) _w.call(_48);
                }
                finally { if (e_196) throw e_196.error; }
            }
            surface(deli, -0.17, 0.625, 0.587, 0.93, 0.22, sectionLabels.deli);
            try {
                for (var _52 = __values([-0.715, 0.715]), _53 = _52.next(); !_53.done; _53 = _52.next()) {
                    var x = _53.value;
                    box2(deli, x, 0.77, 0.01, 0.03, 0.101, 1.1, "#ac9f83");
                }
            }
            catch (e_198_1) { e_198 = { error: e_198_1 }; }
            finally {
                try {
                    if (_53 && !_53.done && (_y = _52.return)) _y.call(_52);
                }
                finally { if (e_198) throw e_198.error; }
            }
            var freezer = group(shop, 2.91, 0, -1.4, pi / 2);
            box2(freezer, 0, 0.445, 0, 1.42, 0.71, 0.72, "#d0d5bb", true);
            box2(freezer, 0, 0.817, 0, 1.46, 0.075, 0.76, "#a6bbb1", true);
            try {
                for (var _54 = __values([-0.352, 0.352]), _55 = _54.next(); !_55.done; _55 = _54.next()) {
                    var x = _55.value;
                    ground(freezer, x, 0.858, 0, 0.668, 0.65, lit("#bbded6"));
                    box2(freezer, x, 0.873, 0.181, 0.19, 0.031, 0.038, "#839e9c");
                }
            }
            catch (e_199_1) { e_199 = { error: e_199_1 }; }
            finally {
                try {
                    if (_55 && !_55.done && (_z = _54.return)) _z.call(_54);
                }
                finally { if (e_199) throw e_199.error; }
            }
            surface(freezer, 0, 0.58, 0.366, 1.04, 0.208, labelMaterial("\u30A2\u30A4\u30B9", "ICE CREAM", "#488394"));
            var counter = group(shop, -2.8, 0, 1.67);
            box2(counter, 0, 0.55, 0, 2.32, 0.95, 0.75, "#9a836e", true);
            box2(counter, 0, 0.425, 0.39, 2.24, 0.63, 0.073, "#d6ba94", true);
            for (var j = 0; j < 17; j++)
                box2(counter, -1.071 + j * 0.134, 0.427, 0.434, 0.013, 0.579, 9e-3, "#ba9a78");
            box2(counter, 0, 1.043, 0.02, 2.43, 0.09, 0.82, "#f2dab5", true);
            box2(counter, 0, 0.914, 0.431, 2.32, 0.081, 0.033, teal);
            surface(counter, 0.16, 0.64, 0.436, 0.94, 0.238, sectionLabels.register);
            box2(counter, 0.79, 1.123, -0.035, 0.43, 0.071, 0.311, "#626965", true);
            var till = group(counter, 0.8, 1.341, -0.117, -0.14);
            var screen = box2(till, 0, 0, 0, 0.397, 0.238, 0.071, "#434f51", true);
            screen.rotation.x = -0.2;
            var screenLabel = signTexture(160, 96, function (c) {
                rect(c, "#254a49", 0, 0, 160, 96);
                type(c, "0.00", 131, 67, 39, "#94eed2", 700, "right");
                rect(c, "#bde3ac", 12, 15, 24, 4);
            });
            surface(till, 0, 3e-3, 0.038, 0.35, 0.173, screenLabel).rotation.x = -0.2;
            box2(counter, 0.46, 1.136, 0.209, 0.137, 0.081, 0.204, "#586667", true);
            box2(counter, 0.46, 1.181, 0.202, 0.087, 0.01, 0.092, lit("#9fcdb6"));
            var oden = group(counter, -0.54, 1.082, 0.064);
            box2(oden, 0, 0.107, 0, 1.02, 0.191, 0.457, "#777e72", true);
            box2(oden, 0, 0.217, 0, 0.962, 0.037, 0.42, "#b49669");
            try {
                for (var _56 = __values([-0.32, 0, 0.32]), _57 = _56.next(); !_57.done; _57 = _56.next()) {
                    var x = _57.value;
                    try {
                        for (var _58 = (e_201 = void 0, __values([-0.104, 0.105])), _59 = _58.next(); !_59.done; _59 = _58.next()) {
                            var z = _59.value;
                            box2(oden, x, 0.24, z, 0.274, 0.017, 0.18, "#ac8159");
                            for (var i = 0; i < 3; i++)
                                cyl(oden, x - 0.083 + i * 0.081, 0.252, z, 0.035 + rand() * 0.014, 0.035, choose(["#c3935b", "#e2b97d", "#836e51"]));
                        }
                    }
                    catch (e_201_1) { e_201 = { error: e_201_1 }; }
                    finally {
                        try {
                            if (_59 && !_59.done && (_1 = _58.return)) _1.call(_58);
                        }
                        finally { if (e_201) throw e_201.error; }
                    }
                    box2(oden, x + 0.15, 0.251, 0, 0.014, 0.018, 0.423, "#d4bd92");
                }
            }
            catch (e_200_1) { e_200 = { error: e_200_1 }; }
            finally {
                try {
                    if (_57 && !_57.done && (_0 = _56.return)) _0.call(_56);
                }
                finally { if (e_200) throw e_200.error; }
            }
            box2(oden, 0, 0.361, -0.185, 1.01, 0.12, 0.035, "#a08464");
            surface(oden, 0, 0.369, -0.165, 0.737, 0.149, sectionLabels.oden);
            var service = group(shop, -3.73, 0, -0.52, pi / 2);
            box2(service, 0, 0.52, 0, 1.78, 0.91, 0.55, "#b9a98c", true);
            box2(service, 0, 1.003, 0, 1.86, 0.073, 0.58, "#e4c8a6", true);
            box2(service, -0.16, 1.34, -0.03, 0.61, 0.65, 0.45, "#4d5758", true);
            box2(service, -0.16, 1.51, 0.204, 0.57, 0.222, 0.025, "#829083");
            surface(service, -0.16, 1.5, 0.222, 0.53, 0.143, sectionLabels.coffee);
            box2(service, -0.16, 1.205, 0.203, 0.37, 0.23, 0.032, "#343e40");
            box2(service, -0.16, 1.306, 0.249, 0.088, 0.033, 0.12, "#9da294");
            cyl(service, -0.16, 1.135, 0.253, 0.056, 0.12, "#ddc59b");
            try {
                for (var _60 = __values([0.3, 0.49, 0.68]), _61 = _60.next(); !_61.done; _61 = _60.next()) {
                    var x = _61.value;
                    cyl(service, x, 1.139, 0.019, 0.068, 0.24, "#d9c2a2");
                    for (var i = 0; i < 4; i++)
                        cyl(service, x, 1.066 + i * 0.056, 0.019, 0.071, 0.015, "#f4debb");
                }
            }
            catch (e_202_1) { e_202 = { error: e_202_1 }; }
            finally {
                try {
                    if (_61 && !_61.done && (_2 = _60.return)) _2.call(_60);
                }
                finally { if (e_202) throw e_202.error; }
            }
            box2(shop, -2.88, 1.13, -2.95, 1.03, 2.12, 0.075, "#758879", true);
            box2(shop, -2.88, 1.16, -2.905, 0.911, 1.97, 0.029, "#9ba68d", true);
            surface(shop, -2.88, 1.76, -2.887, 0.72, 0.185, labelMaterial("\u95A2\u4FC2\u8005\u5C02\u7528", "STAFF ONLY", "#577268"));
            box2(shop, -2.54, 1.04, -2.853, 0.051, 0.104, 0.059, "#d5c3a2");
            try {
                for (var _62 = __values([-3.78, -3.43]), _63 = _62.next(); !_63.done; _63 = _62.next()) {
                    var x = _63.value;
                    box2(shop, x, 1.047, -2.759, 0.33, 1.84, 0.373, "#aab49b", true);
                    try {
                        for (var _64 = (e_204 = void 0, __values([0.625, 1.501])), _65 = _64.next(); !_65.done; _65 = _64.next()) {
                            var y = _65.value;
                            box2(shop, x, y, -2.564, 0.31, 0.817, 0.026, "#bdbea3", true);
                            for (var i = 0; i < 3; i++)
                                box2(shop, x, y + 0.222 + i * 0.034, -2.546, 0.17, 0.012, 0.016, "#788f83");
                            box2(shop, x + 0.082, y, -2.54, 0.033, 0.068, 0.024, "#738b82");
                        }
                    }
                    catch (e_204_1) { e_204 = { error: e_204_1 }; }
                    finally {
                        try {
                            if (_65 && !_65.done && (_4 = _64.return)) _4.call(_64);
                        }
                        finally { if (e_204) throw e_204.error; }
                    }
                }
            }
            catch (e_203_1) { e_203 = { error: e_203_1 }; }
            finally {
                try {
                    if (_63 && !_63.done && (_3 = _62.return)) _3.call(_62);
                }
                finally { if (e_203) throw e_203.error; }
            }
            var poster = function (heading, detail, bg, fg, motif) { return signTexture(256, 384, function (c, w, h) {
                var e_214, _d;
                rect(c, bg, 0, 0, w, h);
                rect(c, "#fff4d77a", 8, 8, w - 16, h - 16);
                rect(c, bg, 12, 12, w - 24, h - 24);
                type(c, heading, 128, 68, 42, fg, 800, "center");
                if (motif === "onigiri") {
                    c.beginPath();
                    c.moveTo(128, 111);
                    c.quadraticCurveTo(143, 108, 160, 140);
                    c.lineTo(206, 222);
                    c.quadraticCurveTo(224, 260, 188, 270);
                    c.lineTo(71, 270);
                    c.quadraticCurveTo(31, 263, 50, 222);
                    c.lineTo(101, 130);
                    c.quadraticCurveTo(116, 108, 128, 111);
                    c.fillStyle = "#fff1cb";
                    c.fill();
                    rect(c, "#456054", 99, 214, 59, 54);
                    for (var i = 0; i < 30; i++)
                        rect(c, "#cfb791", 86 + rand() * 90, 161 + rand() * 49, 4, 2);
                }
                else if (motif === "coffee") {
                    c.beginPath();
                    c.ellipse(128, 207, 77, 73, 0, 0, pi * 2);
                    c.fillStyle = "#f1cd92";
                    c.fill();
                    c.beginPath();
                    c.ellipse(128, 207, 55, 53, 0, 0, pi * 2);
                    c.fillStyle = "#8e5644";
                    c.fill();
                    crescent(c, 125, 205, 32, "#efc98b", "#8e5644");
                }
                else {
                    crescent(c, 126, 188, 72, "#f6d293", bg);
                    try {
                        for (var _e = __values([[169, 131, 6], [202, 164, 4], [147, 102, 4], [208, 112, 8]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var _g = __read(_f.value, 3), x = _g[0], y = _g[1], r = _g[2];
                            c.beginPath();
                            c.arc(x, y, r, 0, pi * 2);
                            c.fillStyle = "#d9e7c6";
                            c.fill();
                        }
                    }
                    catch (e_214_1) { e_214 = { error: e_214_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                        }
                        finally { if (e_214) throw e_214.error; }
                    }
                }
                rect(c, fg, 30, 301, 196, 2);
                type(c, detail, 128, 344, 27, fg, 700, "center");
            }); };
            var ricePoster = poster("\u65B0\u767A\u58F2", "\u624B\u3080\u3059\u3073  \xA5160", "#a65749", "#fff0cb", "onigiri");
            var cafePoster = poster("\u6708\u706F\u73C8\u7432", "\u307B\u3063\u3068\u3072\u3068\u606F", "#d49c68", "#563e38", "coffee");
            var nightPoster = poster("\u591C\u306E\u4FBF\u308A", "\u6708\u706F\u753A 24H", "#3e766e", "#e7e6bb", "moon");
            surface(shop, -1.96, 2.16, -2.946, 0.74, 0.95, ricePoster);
            surface(shop, -3.947, 2.07, 0.285, 0.65, 0.89, cafePoster, pi / 2);
            surface(shop, -3.54, 1.63, 3.064, 0.44, 0.62, ricePoster);
            surface(shop, 4.116, 1.66, -2.52, 0.52, 0.73, nightPoster, pi / 2);
            var magazines = group(shop, 2.69, 0, 2.69);
            box2(magazines, 0, 0.486, 0, 1.39, 0.85, 0.278, "#96a690", true);
            for (var r = 0; r < 3; r++) {
                box2(magazines, 0, 0.269 + r * 0.246, 0.098, 1.41, 0.032, 0.233, "#ddcaa9", true);
                for (var i = 0; i < 4; i++) {
                    var x = -0.51 + i * 0.34;
                    var h = 0.241 + rand() * 0.035;
                    box2(magazines, x, 0.4 + r * 0.246, 0.18, 0.239, h, 0.03, choose(snackColors));
                    surface(magazines, x, 0.4 + r * 0.246, 0.197, 0.219, h - 0.013, [cafePoster, nightPoster, ricePoster][(r + i) % 3]);
                }
                box2(magazines, 0, 0.342 + r * 0.246, 0.221, 1.43, 0.027, 0.022, "#95a08a");
            }
            var queue = signTexture(256, 112, function (c) {
                rect(c, "#668878", 0, 0, 256, 112);
                type(c, "\u30EC\u30B8  \u2192", 128, 74, 48, "#f6e3be", 700, "center");
            });
            ground(shop, -0.96, 0.081, 1.91, 1.14, 0.42, queue);
            function condenser(parent, x, y, z, scale, yaw) {
                var e_215, _d;
                if (scale === void 0) { scale = 1; }
                if (yaw === void 0) { yaw = 0; }
                var g = group(parent, x, y, z, yaw);
                g.scale.setScalar(scale);
                box2(g, 0, 0.283, 0, 1.22, 0.52, 0.54, "#82959a", true);
                box2(g, 0, 0.551, 0, 1.25, 0.043, 0.56, "#9eb0ac", true);
                box2(g, -0.223, 0.294, 0.277, 0.549, 0.439, 0.028, "#435965", true);
                var disc = cyl(g, -0.222, 0.293, 0.3, 0.205, 0.028, "#243d4b");
                disc.rotation.x = pi / 2;
                for (var i = 0; i < 4; i++) {
                    var t = i * pi / 2;
                    var blade = box2(g, -0.222 + Math.cos(t) * 0.088, 0.293 + Math.sin(t) * 0.088, 0.319, 0.138, 0.049, 0.013, "#718c93");
                    blade.rotation.z = t + 0.3;
                }
                for (var i = -4; i <= 4; i++) {
                    var dx = i * 0.044;
                    box2(g, -0.222 + dx, 0.293, 0.335, 0.013, 2 * Math.sqrt(0.038 - dx * dx), 0.012, "#99aaab");
                }
                for (var i = 0; i < 6; i++)
                    box2(g, 0.33, 0.15 + i * 0.046, 0.281, 0.321, 0.014, 0.014, "#526b74");
                box2(g, 0.383, 0.455, 0.287, 0.216, 0.052, 0.01, "#c4c8ae");
                try {
                    for (var _e = __values([-0.46, 0.46]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var x2 = _f.value;
                        box2(g, x2, 0.02, 0, 0.141, 0.081, 0.63, "#455a65", true);
                    }
                }
                catch (e_215_1) { e_215 = { error: e_215_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_215) throw e_215.error; }
                }
                return g;
            }
            condenser(shop, 1.88, 3.437, -1.82, 1.24, -0.12);
            condenser(shop, 0.2, 3.436, -2.09, 1, -0.12);
            condenser(shop, -4.26, 0.47, -1.28, 0.73, -pi / 2);
            var vent = group(shop, -2.64, 3.41, -1.27);
            box2(vent, 0, 0.17, 0, 1.2, 0.34, 0.79, "#677f89", true);
            box2(vent, 0, 0.397, 0, 0.79, 0.39, 0.46, "#748d95", true);
            box2(vent, 0, 0.601, 0.045, 0.93, 0.094, 0.58, "#8ca2a4", true);
            for (var j = 0; j < 5; j++)
                box2(vent, 0, 0.329 + j * 0.05, 0.233, 0.681, 0.021, 0.025, "#455c69");
            tube2(shop, v(-2.71, 3.62, -1.64), v(-2.71, 3.62, -2.91), 0.106, "#657d87");
            tube2(shop, v(1.92, 3.511, -2.07), v(1.9, 3.511, -3.06), 0.05, "#93a3a0");
            try {
                for (var _66 = __values([[-3.77, 1.94], [2.95, 2.21], [3.06, -2.82]]), _67 = _66.next(); !_67.done; _67 = _66.next()) {
                    var _68 = __read(_67.value, 2), x = _68[0], z = _68[1];
                    cyl(shop, x, 3.425, z, 0.118, 0.041, "#526b77");
                    for (var i = -2; i <= 2; i++)
                        box2(shop, x + i * 0.035, 3.451, z, 0.01, 0.014, 0.119, "#8ba2a4");
                }
            }
            catch (e_205_1) { e_205 = { error: e_205_1 }; }
            finally {
                try {
                    if (_67 && !_67.done && (_5 = _66.return)) _5.call(_66);
                }
                finally { if (e_205) throw e_205.error; }
            }
            box2(shop, -2.06, 1.06, -3.052, 1.03, 2.06, 0.064, "#586e74", true);
            box2(shop, -2.06, 1.071, -3.09, 0.91, 1.94, 0.025, "#7b8f8b", true);
            box2(shop, -1.73, 1.055, -3.12, 0.064, 0.082, 0.049, "#b1baa9");
            surface(shop, -2.07, 1.62, -3.112, 0.61, 0.186, labelMaterial("\u642C\u5165\u53E3", "DELIVERIES", "#406868"), pi);
            box2(shop, -2.06, 2.231, -3.16, 1.33, 0.13, 0.35, "#4c6571", true);
            box2(shop, -2.06, 2.157, -3.174, 0.89, 0.019, 0.1, warm);
            box2(shop, -4.131, 1.61, -1.06, 0.055, 0.49, 0.48, "#7b8e8e", true);
            box2(shop, 0, 0.182, -3.062, 8.22, 0.28, 0.052, "#697f80", true);
            box2(shop, -4.145, 0.182, 0, 0.054, 0.28, 6.03, "#6a8181", true);
            try {
                for (var _69 = __values([-3.7, -0.95, 1.36, 3.88]), _70 = _69.next(); !_70.done; _70 = _69.next()) {
                    var x = _70.value;
                    box2(shop, x, 1.44, -3.053, 0.02, 2.26, 9e-3, "#7b827a");
                }
            }
            catch (e_206_1) { e_206 = { error: e_206_1 }; }
            finally {
                try {
                    if (_70 && !_70.done && (_6 = _69.return)) _6.call(_69);
                }
                finally { if (e_206) throw e_206.error; }
            }
            try {
                for (var _71 = __values([-2.74, -1.21, 0.66, 2.39]), _72 = _71.next(); !_72.done; _72 = _71.next()) {
                    var z = _72.value;
                    box2(shop, -4.13, 1.44, z, 0.016, 2.26, 0.023, "#75837c");
                }
            }
            catch (e_207_1) { e_207 = { error: e_207_1 }; }
            finally {
                try {
                    if (_72 && !_72.done && (_7 = _71.return)) _7.call(_71);
                }
                finally { if (e_207) throw e_207.error; }
            }
            tube2(shop, v(-4.226, 0.77, -1.76), v(-4.226, 1.62, -1.76), 0.034, "#839898");
            tube2(shop, v(-4.226, 1.62, -1.76), v(-4.226, 1.62, -1.2), 0.034, "#839898");
            try {
                for (var _73 = __values([0.53, 2.74]), _74 = _73.next(); !_74.done; _74 = _73.next()) {
                    var x = _74.value;
                    tube2(shop, v(x, 0.16, -3.098), v(x, 3.395, -3.098), 0.058, "#607a85");
                    try {
                        for (var _75 = (e_209 = void 0, __values([0.69, 1.54, 2.53])), _76 = _75.next(); !_76.done; _76 = _75.next()) {
                            var y = _76.value;
                            cyl(shop, x, y, -3.098, 0.069, 0.047, "#92a7a5");
                        }
                    }
                    catch (e_209_1) { e_209 = { error: e_209_1 }; }
                    finally {
                        try {
                            if (_76 && !_76.done && (_9 = _75.return)) _9.call(_75);
                        }
                        finally { if (e_209) throw e_209.error; }
                    }
                }
            }
            catch (e_208_1) { e_208 = { error: e_208_1 }; }
            finally {
                try {
                    if (_74 && !_74.done && (_8 = _73.return)) _8.call(_73);
                }
                finally { if (e_208) throw e_208.error; }
            }
            for (var j = 0; j < 23; j++)
                box2(shop, -4.147, 0.57, -2.98 + j * 0.263, 0.015, 0.029, 0.242, "#8a9b95");
            doors.forEach(function (door, index) {
                door.name = "Tsukiakari sliding door " + (index + 1);
                door.traverse(function (part) {
                    if (part.isMesh) {
                        part.userData.movingShopDoor = true;
                        part.castShadow = false;
                    }
                });
            });
            batchStaticParts(asset);
            asset.scale.set(-0.81, 0.96, 0.74);
            installation.add(asset);
            function practical(color, intensity, range, at, airGlow) {
                var _d;
                if (airGlow === void 0) { airGlow = 0; }
                var light = new T.PointLight(color, intensity, range, 2);
                (_d = light.position).set.apply(_d, __spreadArray([], __read(at), false));
                if (airGlow)
                    light.userData.airGlow = airGlow;
                asset.add(light);
            }
            practical("#ffe0b2", 6.9, 4.15, [-0.27, 2.23, 3.62], 0.32);
            practical("#fff0cc", 9.2, 4.2, [-1.32, 2.45, 0.96]);
            function pool(x, y, z, w, d, color, strength) {
                lightPaint2.add(installation, [-x * 0.81, y * 0.96, z * 0.74], [w * 0.81, d * 0.74], color, strength, true);
            }
            pool(-0.23, 0.079, 1.3, 3.02, 2.58, "#fff0cf", 0.27);
            pool(2.04, 0.08, -1.23, 2.24, 2.62, "#c8f1e9", 0.23);
            pool(-2.82, 1.095, 1.71, 1.9, 0.67, "#ffc484", 0.29);
            lightPaint2.add(installation, [0.21, 4e-3, 3.85], [3.03, 1.73], "#f7dab2", 0.27, true);
            var previousOpen = -1;
            return function (seconds) {
                var e_216, _d;
                var phase = T.MathUtils.euclideanModulo(seconds + 3.3, 18.6);
                var open = T.MathUtils.smoothstep(phase, 5.9, 6.72) * (1 - T.MathUtils.smoothstep(phase, 8.63, 9.62));
                if (open === previousOpen)
                    return;
                previousOpen = open;
                doors[0].position.x = -0.79 - 0.93 * open;
                doors[1].position.x = 0.295 + 0.93 * open;
                try {
                    for (var doors_1 = __values(doors), doors_1_1 = doors_1.next(); !doors_1_1.done; doors_1_1 = doors_1.next()) {
                        var door = doors_1_1.value;
                        door.updateWorldMatrix(true, true);
                    }
                }
                catch (e_216_1) { e_216 = { error: e_216_1 }; }
                finally {
                    try {
                        if (doors_1_1 && !doors_1_1.done && (_d = doors_1.return)) _d.call(doors_1);
                    }
                    finally { if (e_216) throw e_216.error; }
                }
            };
        }
        function buildConvenience(parent, lightPaint2) {
            var e_217, _d, e_218, _e;
            var store = new THREE.Group();
            store.name = "\u6708\u706F\u30DE\u30FC\u30C8 \xB7 Tsukiakari street corner";
            store.position.set(-5.42, 0.18, -11.39);
            store.rotation.y = Math.PI / 2;
            parent.add(store);
            var unitBox = new THREE.BoxGeometry(1, 1, 1);
            var unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
            var up = new THREE.Vector3(0, 1, 0);
            var quaternion = new THREE.Quaternion();
            var part = new THREE.Object3D();
            var batches = new Map();
            var standard = function (color, options) {
                if (options === void 0) { options = {}; }
                return new THREE.MeshStandardMaterial(__spreadValues({ color: color, roughness: 0.72 }, options));
            };
            var plaster = standard("#b6bcb2");
            var concrete = standard("#adab9e");
            var trim = standard("#3e5054");
            var rubber = standard("#2e3239");
            var cyan = standard("#2d6692");
            var deepBlue = standard("#214c70");
            function instance(geometry, finish, x, y, z, w, h, d, rotation, shadows) {
                if (rotation === void 0) { rotation = quaternion; }
                if (shadows === void 0) { shadows = true; }
                var key = "".concat(geometry.id, "/").concat(finish.id, "/").concat(shadows);
                if (!batches.has(key))
                    batches.set(key, { geometry: geometry, finish: finish, shadows: shadows, matrices: [] });
                part.position.set(x, y, z);
                part.quaternion.copy(rotation);
                part.scale.set(w, h, d);
                part.updateMatrix();
                batches.get(key).matrices.push(part.matrix.clone());
            }
            function box2(finish, x, y, z, w, h, d, shadows) {
                if (shadows === void 0) { shadows = true; }
                instance(unitBox, finish, x, y, z, w, h, d, quaternion, shadows);
            }
            function rod2(finish, a, b, radius, shadows) {
                var _d, _e;
                if (shadows === void 0) { shadows = true; }
                var start = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(a), false)))();
                var end = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(b), false)))();
                var delta = end.clone().sub(start);
                var length = delta.length();
                var mid = start.lerp(end, 0.5);
                var rotation = new THREE.Quaternion().setFromUnitVectors(up, delta.normalize());
                instance(unitCylinder, finish, mid.x, mid.y, mid.z, radius, length, radius, rotation, shadows);
            }
            function image(width, height, draw) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                draw(canvas.getContext("2d"), width, height);
                var map = new THREE.CanvasTexture(canvas);
                map.colorSpace = THREE.SRGBColorSpace;
                map.anisotropy = 6;
                return map;
            }
            function panel(finish, x, y, z, w, h, angle) {
                if (angle === void 0) { angle = 0; }
                var surface = new THREE.Mesh(new THREE.PlaneGeometry(w, h), finish);
                surface.position.set(x, y, z);
                surface.rotation.y = angle;
                store.add(surface);
            }
            function print(map, emission, tint) {
                if (tint === void 0) { tint = "#ffffff"; }
                return standard(tint, { map: map, emissiveMap: map, emissive: "#ffffff", emissiveIntensity: emission });
            }
            var brass = standard("#c39966", { metalness: 0.3 });
            var updateDoors = buildTsukiakariStore(store, lightPaint2);
            var ramp = new THREE.BufferGeometry();
            var low = -1.4 * 0.81, high = 0.9 * 0.81, sill = 0.105 * 0.96, lip = 3.29 * 0.74;
            var toe = lip + sill * 12;
            ramp.setAttribute("position", new THREE.Float32BufferAttribute([
                low,
                sill,
                lip,
                low,
                2e-3,
                toe,
                high,
                sill,
                lip,
                high,
                sill,
                lip,
                low,
                2e-3,
                toe,
                high,
                2e-3,
                toe
            ], 3));
            ramp.computeVertexNormals();
            var approach = new THREE.Mesh(ramp, concrete);
            approach.name = "Clear shop entry, 1:12 accessible approach";
            approach.receiveShadow = true;
            store.add(approach);
            var binLabel = image(240, 112, function (ctx, w, h) {
                ctx.fillStyle = "#b5d4d6";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#325b73";
                ctx.font = 'bold 40px "Yu Gothic", "Microsoft YaHei", sans-serif';
                ctx.textAlign = "center";
                ctx.fillText("\u3054\u307F\u7BB1", w / 2, 52);
                ctx.font = "bold 15px system-ui, sans-serif";
                ctx.fillText("WASTE", w / 2, 83);
            });
            box2(deepBlue, -2.93, 0.13, 2.88, 0.65, 0.26, 0.51);
            box2(cyan, -2.93, 0.47, 2.88, 0.69, 0.64, 0.5);
            box2(deepBlue, -2.93, 0.8, 2.88, 0.73, 0.14, 0.54);
            box2(rubber, -2.93, 0.81, 3.158, 0.49, 0.08, 0.025);
            panel(print(binLabel, 0.17), -2.93, 0.48, 3.138, 0.38, 0.18);
            var newsMap = image(192, 176, function (ctx, w, h) {
                ctx.fillStyle = "#f0e1c3";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#48646a";
                ctx.textAlign = "center";
                ctx.font = 'bold 30px "Yu Gothic", "Microsoft YaHei", sans-serif';
                ctx.fillText("\u5915\u51EA\u65B0\u805E", w / 2, 38);
                ctx.fillRect(12, 48, w - 24, 4);
                ctx.fillStyle = "#907a6f";
                for (var row = 0; row < 4; row++)
                    ctx.fillRect(15, 62 + row * 11, 50 + row % 2 * 19, 3);
                ctx.fillStyle = "#b4785d";
                ctx.fillRect(102, 61, 75, 50);
                ctx.fillStyle = "#778991";
                for (var row = 0; row < 4; row++)
                    ctx.fillRect(16, 123 + row * 10, 130 + row % 2 * 25, 3);
            });
            box2(trim, -2.18, 0.31, 2.81, 0.42, 0.62, 0.32);
            box2(plaster, -2.18, 0.63, 2.81, 0.44, 0.064, 0.34);
            panel(print(newsMap, 0.23), -2.18, 0.43, 2.975, 0.329, 0.3);
            var wheel = new THREE.TorusGeometry(0.265, 0.036, 7, 24);
            var wheelRim = new THREE.TorusGeometry(0.245, 0.012, 6, 24);
            var baskets = standard("#637070", { metalness: 0.36 });
            var spoke = standard("#91a09f", { metalness: 0.25 });
            var finishes = [standard("#779b8e"), standard("#b76851"), standard("#6a89a1")];
            var _loop_15 = function (i, parked) {
                var e_219, _m, e_220, _o, e_221, _p, e_222, _q;
                var _r = __read(parked, 3), x = _r[0], z = _r[1], angle = _r[2];
                var color = finishes[i];
                var rotation = new THREE.Quaternion().setFromAxisAngle(up, angle);
                var point = function (a, b, c) {
                    if (c === void 0) { c = 0; }
                    return [x + a * Math.cos(angle) + c * Math.sin(angle), b, z - a * Math.sin(angle) + c * Math.cos(angle)];
                };
                var frame = function (finish, a, b, radius, cast) {
                    if (cast === void 0) { cast = true; }
                    return rod2(finish, point.apply(void 0, __spreadArray([], __read(a), false)), point.apply(void 0, __spreadArray([], __read(b), false)), radius, cast);
                };
                var prop = function (finish, p, w, h, d, cast) {
                    if (cast === void 0) { cast = true; }
                    return instance.apply(void 0, __spreadArray(__spreadArray([unitBox, finish], __read(point.apply(void 0, __spreadArray([], __read(p), false))), false), [w, h, d, rotation, cast], false));
                };
                try {
                    for (var _s = (e_219 = void 0, __values([-0.45, 0.45])), _t = _s.next(); !_t.done; _t = _s.next()) {
                        var axle = _t.value;
                        var center = point(axle, 0.303);
                        instance.apply(void 0, __spreadArray(__spreadArray([wheel, rubber], __read(center), false), [1, 1, 1, rotation], false));
                        instance.apply(void 0, __spreadArray(__spreadArray([wheelRim, spoke], __read(center), false), [1, 1, 1, rotation, false], false));
                        for (var n = 0; n < 8; n++) {
                            var turn = n * Math.PI / 4;
                            frame(spoke, [axle, 0.303], [axle + Math.cos(turn) * 0.235, 0.303 + Math.sin(turn) * 0.235], 6e-3, false);
                        }
                        frame(brass, [axle, 0.303, -0.048], [axle, 0.303, 0.048], 0.023, false);
                    }
                }
                catch (e_219_1) { e_219 = { error: e_219_1 }; }
                finally {
                    try {
                        if (_t && !_t.done && (_m = _s.return)) _m.call(_s);
                    }
                    finally { if (e_219) throw e_219.error; }
                }
                try {
                    for (var _u = (e_220 = void 0, __values([
                        [[-0.45, 0.303], [-0.2, 0.592], 0.018],
                        [[-0.45, 0.303], [-0.02, 0.28], 0.018],
                        [[-0.02, 0.28], [-0.2, 0.592], 0.026],
                        [[-0.02, 0.28], [0.29, 0.55], 0.024],
                        [[-0.2, 0.575], [0.3, 0.586], 0.021],
                        [[0.45, 0.303], [0.28, 0.65], 0.025]
                    ])), _v = _u.next(); !_v.done; _v = _u.next()) {
                        var _w = __read(_v.value, 3), a = _w[0], b = _w[1], r = _w[2];
                        frame(color, a, b, r);
                    }
                }
                catch (e_220_1) { e_220 = { error: e_220_1 }; }
                finally {
                    try {
                        if (_v && !_v.done && (_o = _u.return)) _o.call(_u);
                    }
                    finally { if (e_220) throw e_220.error; }
                }
                frame(spoke, [-0.2, 0.585], [-0.24, 0.675], 0.019);
                frame(spoke, [0.28, 0.645], [0.3, 0.753], 0.018);
                frame(spoke, [0.3, 0.753], [0.32, 0.765, 0.113], 0.014);
                frame(spoke, [0.3, 0.753], [0.32, 0.765, -0.113], 0.014);
                frame(rubber, [0.32, 0.765, -0.072], [0.32, 0.765, -0.139], 0.021);
                frame(rubber, [0.32, 0.765, 0.072], [0.32, 0.765, 0.139], 0.021);
                prop(rubber, [-0.27, 0.689], 0.2, 0.038, 0.094);
                prop(rubber, [-0.018, 0.285], 0.103, 0.048, 0.068);
                prop(baskets, [0.448, 0.604], 0.218, 0.021, 0.184);
                try {
                    for (var _x = (e_221 = void 0, __values([-0.096, 0.096])), _y = _x.next(); !_y.done; _y = _x.next()) {
                        var d = _y.value;
                        frame(baskets, [0.34, 0.759, d], [0.55, 0.759, d], 0.011);
                        frame(baskets, [0.34, 0.686, d], [0.55, 0.686, d], 9e-3);
                        for (var j = 0; j < 5; j++)
                            frame(baskets, [0.34 + j * 0.052, 0.602, d], [0.34 + j * 0.052, 0.763, d], 7e-3, false);
                    }
                }
                catch (e_221_1) { e_221 = { error: e_221_1 }; }
                finally {
                    try {
                        if (_y && !_y.done && (_p = _x.return)) _p.call(_x);
                    }
                    finally { if (e_221) throw e_221.error; }
                }
                try {
                    for (var _z = (e_222 = void 0, __values([0.34, 0.55])), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                        var a = _0.value;
                        frame(baskets, [a, 0.759, -0.096], [a, 0.759, 0.096], 0.011);
                        for (var j = -2; j <= 2; j++)
                            frame(baskets, [a, 0.6, j * 0.045], [a, 0.759, j * 0.045], 7e-3, false);
                    }
                }
                catch (e_222_1) { e_222 = { error: e_222_1 }; }
                finally {
                    try {
                        if (_0 && !_0.done && (_q = _z.return)) _q.call(_z);
                    }
                    finally { if (e_222) throw e_222.error; }
                }
                frame(trim, [-0.14, 0.287, 0.01], [-0.18, 0.028, 0.15], 0.012);
            };
            try {
                for (var _f = __values([[0, [1.55, 3.54, 0.38]], [1, [2.58, 3.53, 0.48]], [2, [3.6, 3.55, 0.6]]]), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), i = _h[0], parked = _h[1];
                    _loop_15(i, parked);
                }
            }
            catch (e_217_1) { e_217 = { error: e_217_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                }
                finally { if (e_217) throw e_217.error; }
            }
            var _loop_16 = function (geometry, finish, shadows, matrices) {
                var collection = new THREE.InstancedMesh(geometry, finish, matrices.length);
                matrices.forEach(function (matrix2, index) { return collection.setMatrixAt(index, matrix2); });
                collection.castShadow = shadows;
                collection.receiveShadow = true;
                store.add(collection);
            };
            try {
                for (var _j = __values(batches.values()), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var _l = _k.value, geometry = _l.geometry, finish = _l.finish, shadows = _l.shadows, matrices = _l.matrices;
                    _loop_16(geometry, finish, shadows, matrices);
                }
            }
            catch (e_218_1) { e_218 = { error: e_218_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                }
                finally { if (e_218) throw e_218.error; }
            }
            return updateDoors;
        }
        function buildParking(parent) {
            var e_223, _d, e_224, _e, e_225, _f, e_226, _g, e_227, _h, e_228, _j, e_229, _k, e_230, _l, e_231, _m, e_232, _o, e_233, _p, e_234, _q, e_235, _r;
            var lot = new THREE.Group();
            lot.name = "\u5915\u51EA \u30B3\u30A4\u30F3\u30D1\u30FC\u30AD\u30F3\u30B0";
            parent.add(lot);
            var atGround = 0.193;
            var nearX = 5.02;
            var farX = 11.65;
            var backZ = 8.25;
            var forwardZ = 13.83;
            var width = farX - nearX;
            var length = forwardZ - backZ;
            var unitBox = new THREE.BoxGeometry();
            var unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 18);
            var unitY = new THREE.Vector3(0, 1, 0);
            var batches = new Map();
            var stamp = new THREE.Object3D();
            function finish(color, options) {
                if (options === void 0) { options = {}; }
                return new THREE.MeshStandardMaterial(__spreadValues({ color: color, roughness: 0.74 }, options));
            }
            function model2(host, geometry, material2, x, y, z, shadows) {
                if (shadows === void 0) { shadows = true; }
                var mesh = new THREE.Mesh(geometry, material2);
                mesh.castShadow = shadows;
                mesh.receiveShadow = true;
                mesh.position.set(x, y, z);
                host.add(mesh);
                return mesh;
            }
            function repeat(host, geometry, material2, position, size, rotation, shadows) {
                var _d, _e;
                if (shadows === void 0) { shadows = true; }
                var key = "".concat(host.id, ".").concat(geometry.id, ".").concat(material2.id, ".").concat(shadows);
                if (!batches.has(key))
                    batches.set(key, { host: host, geometry: geometry, material: material2, shadows: shadows, matrices: [] });
                (_d = stamp.position).set.apply(_d, __spreadArray([], __read(position), false));
                (_e = stamp.scale).set.apply(_e, __spreadArray([], __read(size), false));
                stamp.quaternion.copy(rotation);
                stamp.updateMatrix();
                batches.get(key).matrices.push(stamp.matrix.clone());
            }
            var straight = new THREE.Quaternion();
            function box2(host, material2, x, y, z, w, h, d, shadows) {
                if (shadows === void 0) { shadows = true; }
                repeat(host, unitBox, material2, [x, y, z], [w, h, d], straight, shadows);
            }
            function pipe(host, material2, from, to, radius, shadows) {
                var _d, _e;
                if (shadows === void 0) { shadows = true; }
                var start = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(from), false)))();
                var end = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(to), false)))();
                var vector = end.clone().sub(start);
                var angle = new THREE.Quaternion().setFromUnitVectors(unitY, vector.clone().normalize());
                repeat(host, unitCylinder, material2, start.lerp(end, 0.5).toArray(), [radius, vector.length(), radius], angle, shadows);
            }
            function paint(w, h, draw) {
                var canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                draw(canvas.getContext("2d"), w, h);
                var map = new THREE.CanvasTexture(canvas);
                map.colorSpace = THREE.SRGBColorSpace;
                map.anisotropy = 8;
                return map;
            }
            function print(host, map, w, h, x, y, z, angle, light) {
                if (angle === void 0) { angle = 0; }
                if (light === void 0) { light = 0; }
                var sign = model2(host, new THREE.PlaneGeometry(w, h), finish(16777215, {
                    map: map,
                    emissiveMap: map,
                    emissive: 16777215,
                    emissiveIntensity: light
                }), x, y, z, false);
                sign.rotation.y = angle;
                return sign;
            }
            var font = '"Yu Gothic", "Meiryo", "Microsoft YaHei", sans-serif';
            var tarmac = paint(1024, 864, function (ctx, w, h) {
                var e_236, _d, e_237, _e;
                var seed = 727;
                function random() {
                    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
                    return seed / 4294967296;
                }
                var base = ctx.createLinearGradient(0, 0, w, h);
                base.addColorStop(0, "#414451");
                base.addColorStop(0.55, "#595963");
                base.addColorStop(1, "#464755");
                ctx.fillStyle = base;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#d6c8ac";
                var coord = function (x, z) { return [(x - nearX) / width * w, (z - backZ) / length * h]; };
                function line(x0, z0, x1, z1, thickness) {
                    var p = coord(x0, z0);
                    var q = coord(x1, z1);
                    ctx.lineWidth = thickness;
                    ctx.beginPath();
                    ctx.moveTo.apply(ctx, __spreadArray([], __read(p), false));
                    ctx.lineTo.apply(ctx, __spreadArray([], __read(q), false));
                    ctx.stroke();
                }
                ctx.strokeStyle = "#d9cdb6";
                try {
                    for (var _f = __values([8.65, 10.91, 13.37]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var z = _g.value;
                        line(7.12, z, 11.22, z, 8);
                    }
                }
                catch (e_236_1) { e_236 = { error: e_236_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_236) throw e_236.error; }
                }
                line(11.22, 8.65, 11.22, 13.37, 7);
                ctx.strokeStyle = "#ce9b65";
                line(5.53, 11.52, 6.6, 11.52, 5);
                line(5.53, 8.72, 6.6, 8.72, 5);
                var arrow = [[5.53, 9.96], [6.26, 9.96], [6.26, 9.79], [6.6, 10.09], [6.26, 10.38], [6.26, 10.22], [5.53, 10.22]];
                ctx.beginPath();
                arrow.forEach(function (_d, i) {
                    var _e = __read(_d, 2), x = _e[0], z = _e[1];
                    return i ? ctx.lineTo.apply(ctx, __spreadArray([], __read(coord(x, z)), false)) : ctx.moveTo.apply(ctx, __spreadArray([], __read(coord(x, z)), false));
                });
                ctx.closePath();
                ctx.fill();
                ctx.font = "bold 30px ".concat(font);
                ctx.textAlign = "center";
                ctx.fillText.apply(ctx, __spreadArray(["\u5165\u53E3"], __read(coord(6.14, 10.72)), false));
                ctx.fillStyle = "#cfbfb5";
                ctx.fillText.apply(ctx, __spreadArray(["01"], __read(coord(7.36, 9.3)), false));
                ctx.fillText.apply(ctx, __spreadArray(["02"], __read(coord(7.36, 11.58)), false));
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#2b273382";
                try {
                    for (var _h = __values([[[6.42, 12.68], [6.81, 12.51], [7.16, 12.54], [7.43, 12.08], [7.67, 12.02]], [[8.77, 9.29], [8.96, 9.68], [9.14, 9.7], [9.26, 10.13], [9.52, 10.37]]]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var path = _j.value;
                        ctx.beginPath();
                        path.forEach(function (_d, i) {
                            var _e = __read(_d, 2), x = _e[0], z = _e[1];
                            return i ? ctx.lineTo.apply(ctx, __spreadArray([], __read(coord(x, z)), false)) : ctx.moveTo.apply(ctx, __spreadArray([], __read(coord(x, z)), false));
                        });
                        ctx.stroke();
                    }
                }
                catch (e_237_1) { e_237 = { error: e_237_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_237) throw e_237.error; }
                }
                for (var i = 0; i < 12600; i++) {
                    var bright = random() > 0.52;
                    ctx.fillStyle = bright ? "#fae7cb1d" : "#271f322e";
                    ctx.fillRect(random() * w, random() * h, 0.8 + random() * 2.2, 0.5 + random() * 1.2);
                }
                for (var i = 0; i < 1080; i++) {
                    ctx.fillStyle = "#47405054";
                    ctx.fillRect(6 + random() * (w - 12), 15 + random() * (h - 30), 1.5 + random() * 4.3, 0.8 + random() * 2.5);
                }
            });
            var groundVertices = [];
            var groundUVs = [];
            var groundFaces = [];
            function entryHeight(x) {
                return THREE.MathUtils.lerp(0.018, atGround, THREE.MathUtils.clamp((x - ROAD_RIGHT) / 0.57, 0, 1));
            }
            var tarmacX = [nearX, ROAD_RIGHT + 0.57, farX];
            var tarmacZ = [backZ, DRIVEWAY_BACK - 4e-3, DRIVEWAY_BACK + 6e-3, DRIVEWAY_FRONT - 6e-3, DRIVEWAY_FRONT + 4e-3, forwardZ];
            tarmacZ.forEach(function (z, row) {
                tarmacX.forEach(function (x, column) {
                    var y = row === 2 || row === 3 ? entryHeight(x) : atGround;
                    groundVertices.push(x, y, z);
                    groundUVs.push((x - nearX) / width, 1 - (z - backZ) / length);
                    if (row === 0 || column === 0)
                        return;
                    var j = row * tarmacX.length + column;
                    var stride = tarmacX.length;
                    groundFaces.push(j - stride - 1, j - 1, j, j - stride - 1, j, j - stride);
                });
            });
            var pavement = new THREE.BufferGeometry();
            pavement.setAttribute("position", new THREE.Float32BufferAttribute(groundVertices, 3));
            pavement.setAttribute("uv", new THREE.Float32BufferAttribute(groundUVs, 2));
            pavement.setIndex(groundFaces);
            pavement.computeVertexNormals();
            model2(lot, pavement, finish(16777215, { map: tarmac, roughness: 0.7, envMapIntensity: 0.6 }), 0, 0, 0, false);
            var dampFinish = new THREE.MeshPhysicalMaterial({
                color: 4210256,
                roughness: 0.37,
                metalness: 0.08,
                clearcoat: 0.57,
                clearcoatRoughness: 0.29,
                envMapIntensity: 0.72,
                transparent: true,
                opacity: 0.56,
                depthWrite: false
            });
            try {
                for (var _s = __values([[6.37, 11.34, 0.28, 0.85], [9.91, 9.03, -0.86, 1.05], [7.33, 13.43, 0.55, 0.62]]), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var _u = __read(_t.value, 4), x = _u[0], z = _u[1], angle = _u[2], size = _u[3];
                    var puddle = new THREE.Shape();
                    puddle.moveTo(-0.53, 0);
                    puddle.bezierCurveTo(-0.43, 0.14, -0.26, 0.081, -0.04, 0.108);
                    puddle.bezierCurveTo(0.2, 0.154, 0.41, 0.138, 0.53, 0.037);
                    puddle.bezierCurveTo(0.62, -0.036, 0.44, -0.148, 0.16, -0.123);
                    puddle.bezierCurveTo(-0.03, -0.098, -0.18, -0.11, -0.4, -0.078);
                    puddle.bezierCurveTo(-0.49, -0.057, -0.57, -0.043, -0.53, 0);
                    var mesh = model2(lot, new THREE.ShapeGeometry(puddle, 10), dampFinish, x, atGround + 5e-3, z, false);
                    mesh.rotation.set(-Math.PI / 2, 0, angle);
                    mesh.scale.setScalar(size);
                }
            }
            catch (e_223_1) { e_223 = { error: e_223_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_d = _s.return)) _d.call(_s);
                }
                finally { if (e_223) throw e_223.error; }
            }
            var powder = finish(6190199, { metalness: 0.15 });
            var railMetal = finish(10660516, { metalness: 0.22 });
            var concrete = finish(9996932);
            var rubber = finish(4143689);
            var amber = finish(15515767);
            var charcoal = finish(3290689);
            var wire = [];
            function fence(x0, z0, x1, z1, top) {
                var e_238, _d, e_239, _e;
                var run = Math.hypot(x1 - x0, z1 - z0);
                var dx = (x1 - x0) / run;
                var dz = (z1 - z0) / run;
                var low = atGround + 0.16;
                var high = atGround + top;
                var height = high - low;
                function point(u, y) {
                    return [x0 + u * dx, y, z0 + u * dz];
                }
                try {
                    for (var _f = __values([low, high]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var y = _g.value;
                        pipe(lot, railMetal, point(0, y), point(run, y), 0.024, false);
                    }
                }
                catch (e_238_1) { e_238 = { error: e_238_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_238) throw e_238.error; }
                }
                try {
                    for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var slope = _j.value;
                        for (var u = -height; u < run + height; u += 0.144) {
                            var start = slope > 0 ? Math.max(0, -u) : Math.max(0, u - run);
                            var end = slope > 0 ? Math.min(height, run - u) : Math.min(height, u);
                            if (end <= start)
                                continue;
                            wire.push.apply(wire, __spreadArray(__spreadArray([], __read(point(u + slope * start, low + start)), false), __read(point(u + slope * end, low + end)), false));
                        }
                    }
                }
                catch (e_239_1) { e_239 = { error: e_239_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_239) throw e_239.error; }
                }
                var posts = Math.ceil(run / 2.06);
                for (var i = 0; i <= posts; i++) {
                    var _k = __read(point(i * run / posts, atGround), 3), x = _k[0], z = _k[2];
                    pipe(lot, powder, [x, atGround, z], [x, high + 0.06, z], 0.036);
                    pipe(lot, railMetal, [x, high + 0.035, z], [x, high + 0.065, z], 0.04);
                    box2(lot, concrete, x, atGround + 0.034, z, 0.18, 0.068, 0.18);
                }
            }
            fence(11.5, 8.44, 11.5, 13.67, 0.81);
            fence(5.62, 13.67, 11.5, 13.67, 0.78);
            fence(5.62, 8.44, 11.5, 8.44, 0.98);
            var wireGeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(wire, 3));
            lot.add(new THREE.LineSegments(wireGeometry, new THREE.LineBasicMaterial({ color: 10332588, transparent: true, opacity: 0.37 })));
            var blue = finish(3302276, { metalness: 0.08 });
            var blueDark = finish(2439243);
            var ivory = finish(15459537);
            var signage = paint(256, 320, function (ctx, w, h) {
                ctx.fillStyle = "#1d5377";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#e8f6f2";
                ctx.lineWidth = 4;
                ctx.strokeRect(8, 8, w - 16, h - 16);
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff8e9";
                ctx.font = "bold 135px ".concat(font);
                ctx.fillText("P", w / 2, 144);
                ctx.fillStyle = "#ebd0a0";
                ctx.font = "bold 29px ".concat(font);
                ctx.fillText("24 H", w / 2, 190);
                ctx.fillStyle = "#eaf2eb";
                ctx.font = "bold 28px ".concat(font);
                ctx.fillText("\u5915\u51EA\u99D0\u8ECA\u5834", w / 2, 239);
                ctx.font = "bold 21px ".concat(font);
                ctx.fillText("30\u5206 100\u5186", w / 2, 274);
            });
            var poleX = 5.81;
            var poleZ = 13.05;
            pipe(lot, charcoal, [poleX, atGround, poleZ], [poleX, 2.55, poleZ], 0.055);
            box2(lot, concrete, poleX, atGround + 0.06, poleZ, 0.24, 0.12, 0.24);
            var signBox = new THREE.Group();
            signBox.position.set(poleX, 2.17, poleZ);
            signBox.rotation.y = Math.PI * 0.36;
            lot.add(signBox);
            box2(signBox, blueDark, 0, 0, 0, 0.81, 0.97, 0.104);
            print(signBox, signage, 0.765, 0.917, 0, 0, 0.055, 0, 0.82);
            print(signBox, signage, 0.765, 0.917, 0, 0, -0.055, Math.PI, 0.47);
            var fareX = 5.71;
            var fareZ = 12.04;
            box2(lot, concrete, fareX, atGround + 0.045, fareZ, 0.58, 0.089, 0.51);
            box2(lot, blueDark, fareX, 0.43, fareZ, 0.41, 0.39, 0.39);
            box2(lot, blue, fareX, 0.88, fareZ, 0.5, 0.67, 0.42);
            box2(lot, ivory, fareX, 1.21, fareZ, 0.54, 0.078, 0.45);
            var meterMap = paint(200, 256, function (ctx, w, h) {
                ctx.fillStyle = "#eee6d1";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#385872";
                ctx.fillRect(0, 0, w, 55);
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff5cf";
                ctx.font = "bold 34px ".concat(font);
                ctx.fillText("\u7CBE\u7B97\u6A5F", 100, 38);
                ctx.fillStyle = "#25384b";
                ctx.fillRect(24, 70, 152, 61);
                ctx.fillStyle = "#aeeab8";
                ctx.font = "bold 30px ".concat(font);
                ctx.fillText("100", 100, 112);
                ctx.fillStyle = "#585455";
                ctx.fillRect(32, 149, 69, 17);
                ctx.fillStyle = "#d15532";
                ctx.fillRect(125, 145, 34, 23);
                ctx.fillStyle = "#b29d81";
                ctx.fillRect(26, 190, 148, 7);
                ctx.fillStyle = "#4b4a54";
                ctx.fillRect(54, 215, 92, 22);
            });
            print(lot, meterMap, 0.406, 0.52, fareX - 0.253, 0.918, fareZ, -Math.PI / 2, 0.17);
            var meterSide = paint(128, 128, function (ctx, w, h) {
                ctx.fillStyle = "#2e5371";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#c8d6cc";
                ctx.lineWidth = 2.5;
                ctx.strokeRect(4, 4, w - 8, h - 8);
                ctx.fillStyle = "#f7e1b8";
                ctx.textAlign = "center";
                ctx.font = "bold 25px ".concat(font);
                ctx.fillText("\u7CBE\u7B97", w / 2, 45);
                ctx.fillRect(26, 60, 76, 8);
                for (var i = 0; i < 3; i++)
                    ctx.fillRect(32, 82 + i * 9, 61 - i * 8, 2);
            });
            print(lot, meterSide, 0.266, 0.26, fareX + 0.253, 1, fareZ, Math.PI / 2, 0.23);
            try {
                for (var _v = __values([DRIVEWAY_BACK - 0.025, DRIVEWAY_FRONT + 0.11]), _w = _v.next(); !_w.done; _w = _v.next()) {
                    var z = _w.value;
                    pipe(lot, amber, [5.61, atGround, z], [5.61, atGround + 0.64, z], 0.046);
                    try {
                        for (var _x = (e_225 = void 0, __values([0.35, 0.54, 0.72])), _y = _x.next(); !_y.done; _y = _x.next()) {
                            var y = _y.value;
                            pipe(lot, charcoal, [5.61, y, z], [5.61, y + 0.069, z], 0.047);
                        }
                    }
                    catch (e_225_1) { e_225 = { error: e_225_1 }; }
                    finally {
                        try {
                            if (_y && !_y.done && (_f = _x.return)) _f.call(_x);
                        }
                        finally { if (e_225) throw e_225.error; }
                    }
                }
            }
            catch (e_224_1) { e_224 = { error: e_224_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_e = _v.return)) _e.call(_v);
                }
                finally { if (e_224) throw e_224.error; }
            }
            try {
                for (var _z = __values([9.19, 10.37, 11.51, 12.69]), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                    var z = _0.value;
                    box2(lot, rubber, 10.99, atGround + 0.045, z, 0.16, 0.09, 0.49);
                    box2(lot, amber, 10.99, atGround + 0.093, z, 0.132, 0.012, 0.29);
                }
            }
            catch (e_226_1) { e_226 = { error: e_226_1 }; }
            finally {
                try {
                    if (_0 && !_0.done && (_g = _z.return)) _g.call(_z);
                }
                finally { if (e_226) throw e_226.error; }
            }
            box2(lot, concrete, 10.87, 0.217, 10.7, 0.34, 0.046, 0.47);
            for (var i = 0; i < 7; i++)
                box2(lot, charcoal, 10.87, 0.243, 10.52 + i * 0.055, 0.22, 8e-3, 0.027, false);
            var van = new THREE.Group();
            van.name = "Parked kei van";
            van.position.set(9.17, atGround + 3e-3, 12.16);
            van.rotation.y = Math.PI / 2;
            van.scale.set(1.02, 1.075, 1.105);
            lot.add(van);
            var paintGrain = paint(96, 96, function (ctx, w, h) {
                ctx.fillStyle = "#8a8a8a";
                ctx.fillRect(0, 0, w, h);
                var seed = 47;
                for (var i = 0; i < 3300; i++) {
                    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
                    ctx.fillStyle = i % 3 ? "#bcbcbc33" : "#62626233";
                    ctx.fillRect((seed >>> 8) % w, (seed >>> 17) % h, i % 3 + 1, 1);
                }
            });
            paintGrain.colorSpace = THREE.NoColorSpace;
            paintGrain.wrapS = paintGrain.wrapT = THREE.RepeatWrapping;
            paintGrain.repeat.set(2, 2);
            var mint = new THREE.MeshPhysicalMaterial({
                color: 7578523,
                roughness: 0.43,
                metalness: 0.22,
                clearcoat: 0.28,
                clearcoatRoughness: 0.49,
                envMapIntensity: 0.82,
                roughnessMap: paintGrain,
                bumpMap: paintGrain,
                bumpScale: 3e-3
            });
            var paintEdge = finish(10863021, { roughness: 0.56, metalness: 0.18 });
            var mintDark = finish(4942441);
            var roof = finish(14276284, { roughness: 0.6, metalness: 0.1, envMapIntensity: 0.8 });
            var dark = finish(3093568);
            var chrome = finish(11053747, { roughness: 0.38, metalness: 0.52 });
            var tire = finish(3222586, { roughness: 0.92 });
            var grille = finish(5330014, { roughness: 0.6, metalness: 0.27 });
            var glassMap = paint(224, 96, function (ctx, w, h) {
                var gradient = ctx.createLinearGradient(0, 0, w * 0.43, h);
                gradient.addColorStop(0, "#7381a7");
                gradient.addColorStop(0.44, "#3a4766");
                gradient.addColorStop(0.49, "#333b58");
                gradient.addColorStop(0.77, "#293348");
                gradient.addColorStop(1, "#685966");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#282735c0";
                ctx.beginPath();
                ctx.moveTo(w * 0.09, h);
                ctx.lineTo(w * 0.12, h * 0.76);
                ctx.quadraticCurveTo(w * 0.14, h * 0.69, w * 0.23, h * 0.69);
                ctx.lineTo(w * 0.26, h * 0.52);
                ctx.quadraticCurveTo(w * 0.31, h * 0.44, w * 0.37, h * 0.52);
                ctx.lineTo(w * 0.4, h * 0.77);
                ctx.lineTo(w * 0.46, h);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(w * 0.65, h);
                ctx.lineTo(w * 0.68, h * 0.7);
                ctx.lineTo(w * 0.73, h * 0.64);
                ctx.lineTo(w * 0.79, h * 0.66);
                ctx.lineTo(w * 0.85, h);
                ctx.fill();
                ctx.fillStyle = "#d5c8df25";
                ctx.beginPath();
                ctx.moveTo(w * 0.27, 0);
                ctx.lineTo(w * 0.56, 0);
                ctx.lineTo(w * 0.33, h);
                ctx.lineTo(w * 0.145, h);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#bdcbeb22";
                ctx.beginPath();
                ctx.moveTo(w * 0.6, 0);
                ctx.lineTo(w * 0.72, 0);
                ctx.lineTo(w * 0.57, h);
                ctx.lineTo(w * 0.52, h);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#282536ae";
                ctx.lineWidth = 4;
                ctx.strokeRect(3, 3, w - 6, h - 6);
            });
            var glass = finish(16184567, {
                map: glassMap,
                emissive: 11715036,
                emissiveMap: glassMap,
                emissiveIntensity: 0.28,
                roughness: 0.27,
                metalness: 0.23,
                envMapIntensity: 1.04,
                side: THREE.DoubleSide
            });
            function extrusion(shape, depth, bevel, surface) {
                var geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: depth,
                    bevelEnabled: true,
                    steps: 1,
                    bevelThickness: bevel,
                    bevelSize: bevel,
                    bevelSegments: 3,
                    curveSegments: 10
                });
                geometry.translate(0, 0, -depth / 2);
                geometry.rotateY(-Math.PI / 2);
                return model2(van, geometry, surface, 0, 0, 0);
            }
            var lower = new THREE.Shape();
            lower.moveTo(-1.44, 0.39);
            lower.quadraticCurveTo(-1.47, 0.56, -1.44, 0.79);
            lower.quadraticCurveTo(-1.42, 0.91, -1.3, 0.92);
            lower.lineTo(1.3, 0.92);
            lower.quadraticCurveTo(1.46, 0.9, 1.48, 0.76);
            lower.lineTo(1.47, 0.4);
            lower.quadraticCurveTo(1.46, 0.31, 1.34, 0.3);
            lower.lineTo(1.13, 0.3);
            lower.quadraticCurveTo(1.11, 0.495, 0.89, 0.5);
            lower.quadraticCurveTo(0.65, 0.5, 0.63, 0.3);
            lower.lineTo(-0.58, 0.3);
            lower.quadraticCurveTo(-0.6, 0.5, -0.82, 0.5);
            lower.quadraticCurveTo(-1.06, 0.49, -1.08, 0.3);
            lower.lineTo(-1.36, 0.3);
            lower.quadraticCurveTo(-1.44, 0.31, -1.44, 0.39);
            extrusion(lower, 1.39, 0.042, mint);
            var upper = new THREE.Shape();
            upper.moveTo(-1.38, 0.89);
            upper.lineTo(-1.31, 1.39);
            upper.quadraticCurveTo(-1.29, 1.565, -1.03, 1.579);
            upper.lineTo(0.78, 1.579);
            upper.quadraticCurveTo(0.91, 1.579, 1, 1.478);
            upper.lineTo(1.36, 0.89);
            upper.closePath();
            extrusion(upper, 1.3, 0.048, roof);
            function sideGlass(side, points, u0, u1, y0, y1) {
                var e_240, _d;
                var vertices = [];
                var uvs = [];
                try {
                    for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                        var _e = __read(points_1_1.value, 2), z = _e[0], y = _e[1];
                        vertices.push(side * 0.703, y, z);
                        uvs.push((z - u0) / (u1 - u0), (y - y0) / (y1 - y0));
                    }
                }
                catch (e_240_1) { e_240 = { error: e_240_1 }; }
                finally {
                    try {
                        if (points_1_1 && !points_1_1.done && (_d = points_1.return)) _d.call(points_1);
                    }
                    finally { if (e_240) throw e_240.error; }
                }
                var geometry = new THREE.BufferGeometry();
                geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
                geometry.setIndex([0, 1, 2, 0, 2, 3]);
                geometry.computeVertexNormals();
                model2(van, geometry, glass, 0, 0, 0, false);
            }
            try {
                for (var _1 = __values([-1, 1]), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                    var side = _2.value;
                    sideGlass(side, [[-1.25, 0.984], [-1.19, 1.449], [-0.56, 1.451], [-0.56, 0.984]], -1.25, -0.56, 0.984, 1.451);
                    sideGlass(side, [[-0.49, 0.984], [-0.49, 1.451], [0.32, 1.451], [0.32, 0.984]], -0.49, 0.32, 0.984, 1.451);
                    sideGlass(side, [[0.397, 0.984], [0.397, 1.451], [0.897, 1.449], [1.18, 0.984]], 0.397, 1.18, 0.984, 1.451);
                    try {
                        for (var _3 = (e_228 = void 0, __values([-0.53, 0.37, 1.2])), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                            var z = _4.value;
                            box2(van, mintDark, side * 0.741, 0.74, z, 0.01, 0.31, 0.016, false);
                        }
                    }
                    catch (e_228_1) { e_228 = { error: e_228_1 }; }
                    finally {
                        try {
                            if (_4 && !_4.done && (_j = _3.return)) _j.call(_3);
                        }
                        finally { if (e_228) throw e_228.error; }
                    }
                    try {
                        for (var _5 = (e_229 = void 0, __values([-0.22, 0.6])), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                            var z = _6.value;
                            box2(van, chrome, side * 0.75, 0.81, z, 0.031, 0.034, 0.16, false);
                        }
                    }
                    catch (e_229_1) { e_229 = { error: e_229_1 }; }
                    finally {
                        try {
                            if (_6 && !_6.done && (_k = _5.return)) _k.call(_5);
                        }
                        finally { if (e_229) throw e_229.error; }
                    }
                    box2(van, mintDark, side * 0.744, 0.447, 0.01, 0.012, 0.045, 1.15, false);
                    box2(van, paintEdge, side * 0.745, 0.846, -0.61, 9e-3, 0.015, 1.28, false);
                    box2(van, paintEdge, side * 0.745, 0.845, 0.61, 9e-3, 0.015, 1.1, false);
                    box2(van, dark, side * 0.712, 0.921, 0.02, 0.012, 0.026, 2.56, false);
                    box2(van, mintDark, side * 0.745, 0.64, -1.18, 0.012, 0.122, 0.138, false);
                    var mirrorX = side * 0.85;
                    pipe(van, dark, [side * 0.7, 1.04, 1.08], [mirrorX, 1.04, 1.14], 0.025, false);
                    box2(van, mintDark, mirrorX, 1.066, 1.14, 0.11, 0.137, 0.13);
                    box2(van, chrome, mirrorX, 1.064, 1.066, 0.08, 0.105, 0.015, false);
                    try {
                        for (var _7 = (e_230 = void 0, __values([-0.82, 0.89])), _8 = _7.next(); !_8.done; _8 = _7.next()) {
                            var z = _8.value;
                            pipe(van, tire, [side * 0.55, 0.231, z], [side * 0.735, 0.231, z], 0.232);
                            pipe(van, dark, [side * 0.73, 0.231, z], [side * 0.743, 0.231, z], 0.178, false);
                            pipe(van, chrome, [side * 0.743, 0.231, z], [side * 0.752, 0.231, z], 0.129, false);
                            pipe(van, mintDark, [side * 0.751, 0.231, z], [side * 0.759, 0.231, z], 0.052, false);
                            for (var spoke = 0; spoke < 6; spoke++) {
                                var angle = spoke * Math.PI / 3;
                                var y = 0.231 + 0.086 * Math.cos(angle);
                                var offsetZ = 0.086 * Math.sin(angle);
                                pipe(van, dark, [side * 0.753, y, z + offsetZ], [side * 0.758, y, z + offsetZ], 0.016, false);
                            }
                        }
                    }
                    catch (e_230_1) { e_230 = { error: e_230_1 }; }
                    finally {
                        try {
                            if (_8 && !_8.done && (_l = _7.return)) _l.call(_7);
                        }
                        finally { if (e_230) throw e_230.error; }
                    }
                }
            }
            catch (e_227_1) { e_227 = { error: e_227_1 }; }
            finally {
                try {
                    if (_2 && !_2.done && (_h = _1.return)) _h.call(_1);
                }
                finally { if (e_227) throw e_227.error; }
            }
            function windscreen(corners) {
                var geometry = new THREE.BufferGeometry();
                geometry.setAttribute("position", new THREE.Float32BufferAttribute(corners.flat(), 3));
                geometry.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
                geometry.setIndex([0, 1, 2, 0, 2, 3]);
                geometry.computeVertexNormals();
                model2(van, geometry, glass, 0, 0, 0, false);
            }
            windscreen([[-0.58, 1.003, 1.362], [0.58, 1.003, 1.362], [0.52, 1.456, 1.082], [-0.52, 1.456, 1.082]]);
            windscreen([[0.57, 1, -1.427], [-0.57, 1, -1.427], [-0.5, 1.445, -1.367], [0.5, 1.445, -1.367]]);
            try {
                for (var _9 = __values([-1, 1]), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                    var side = _10.value;
                    pipe(van, dark, [side * 0.32, 1.016, 1.365], [side * 0.16, 1.118, 1.302], 0.013, false);
                }
            }
            catch (e_231_1) { e_231 = { error: e_231_1 }; }
            finally {
                try {
                    if (_10 && !_10.done && (_m = _9.return)) _m.call(_9);
                }
                finally { if (e_231) throw e_231.error; }
            }
            pipe(van, dark, [-0.38, 1.618, -0.84], [-0.4, 1.759, -0.95], 0.012, false);
            box2(van, roof, 0, 0.393, 1.49, 1.34, 0.142, 0.17);
            box2(van, dark, 0, 0.328, 1.566, 1.27, 0.033, 0.024, false);
            box2(van, mintDark, 0, 0.391, -1.46, 1.33, 0.15, 0.15);
            box2(van, grille, 0, 0.613, 1.531, 0.59, 0.171, 0.04);
            try {
                for (var _11 = __values([0.568, 0.613, 0.658]), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                    var y = _12.value;
                    box2(van, chrome, 0, y, 1.555, 0.535, 0.012, 0.014, false);
                }
            }
            catch (e_232_1) { e_232 = { error: e_232_1 }; }
            finally {
                try {
                    if (_12 && !_12.done && (_o = _11.return)) _o.call(_11);
                }
                finally { if (e_232) throw e_232.error; }
            }
            var headlamp = finish(16047287, { emissive: 16108960, emissiveIntensity: 0.23, roughness: 0.32, metalness: 0.25 });
            var lampDetail = finish(11905970, { roughness: 0.33, metalness: 0.43 });
            var tail = finish(11557476, { emissive: 8401215, emissiveIntensity: 0.16, roughness: 0.47 });
            try {
                for (var _13 = __values([-0.497, 0.497]), _14 = _13.next(); !_14.done; _14 = _13.next()) {
                    var x = _14.value;
                    box2(van, dark, x, 0.655, 1.524, 0.312, 0.218, 0.064);
                    box2(van, headlamp, x, 0.663, 1.561, 0.247, 0.156, 0.023, false);
                    try {
                        for (var _15 = (e_234 = void 0, __values([0.625, 0.662, 0.703])), _16 = _15.next(); !_16.done; _16 = _15.next()) {
                            var y = _16.value;
                            box2(van, lampDetail, x, y, 1.577, 0.207, 6e-3, 6e-3, false);
                        }
                    }
                    catch (e_234_1) { e_234 = { error: e_234_1 }; }
                    finally {
                        try {
                            if (_16 && !_16.done && (_q = _15.return)) _q.call(_15);
                        }
                        finally { if (e_234) throw e_234.error; }
                    }
                    box2(van, amber, x, 0.559, 1.565, 0.157, 0.039, 0.018, false);
                    box2(van, tail, x, 0.61, -1.496, 0.213, 0.19, 0.052, false);
                    box2(van, amber, x, 0.641, -1.526, 0.172, 0.033, 0.015, false);
                }
            }
            catch (e_233_1) { e_233 = { error: e_233_1 }; }
            finally {
                try {
                    if (_14 && !_14.done && (_p = _13.return)) _p.call(_13);
                }
                finally { if (e_233) throw e_233.error; }
            }
            var plate = paint(192, 72, function (ctx, w, h) {
                ctx.fillStyle = "#e2bd50";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#453d2d";
                ctx.textAlign = "center";
                ctx.font = "bold 15px ".concat(font);
                ctx.fillText("\u5915\u51EA 580", w / 2, 22);
                ctx.font = "bold 32px ".concat(font);
                ctx.fillText("56\u201372", w / 2, 56);
            });
            print(van, plate, 0.27, 0.1, 0, 0.398, 1.579, 0, 0.04);
            print(van, plate, 0.27, 0.1, 0, 0.707, -1.506, Math.PI, 0.04);
            var _loop_17 = function (host, geometry, material2, shadows, matrices) {
                var instances = new THREE.InstancedMesh(geometry, material2, matrices.length);
                matrices.forEach(function (matrix2, index) { return instances.setMatrixAt(index, matrix2); });
                instances.castShadow = shadows;
                instances.receiveShadow = true;
                host.add(instances);
            };
            try {
                for (var _17 = __values(batches.values()), _18 = _17.next(); !_18.done; _18 = _17.next()) {
                    var _19 = _18.value, host = _19.host, geometry = _19.geometry, material2 = _19.material, shadows = _19.shadows, matrices = _19.matrices;
                    _loop_17(host, geometry, material2, shadows, matrices);
                }
            }
            catch (e_235_1) { e_235 = { error: e_235_1 }; }
            finally {
                try {
                    if (_18 && !_18.done && (_r = _17.return)) _r.call(_17);
                }
                finally { if (e_235) throw e_235.error; }
            }
        }
        function buildApartments(parent, lightPaint2) {
            var e_241, _d, e_242, _e, e_243, _f, e_244, _g, e_245, _h, e_246, _j, e_247, _k, e_248, _l, e_249, _m, e_250, _o, e_251, _p, e_252, _q, e_253, _r, e_254, _s, e_255, _t, e_256, _u, e_257, _v, e_258, _w, e_259, _x, e_260, _y, e_261, _z;
            var sharedBox = new THREE.BoxGeometry(1, 1, 1);
            var sharedDrum = new THREE.CylinderGeometry(1, 1, 1, 14);
            var sharedPot = new THREE.CylinderGeometry(1, 0.72, 1, 10);
            var sharedLeaf = new THREE.IcosahedronGeometry(1, 0);
            var identity = new THREE.Quaternion();
            var up = new THREE.Vector3(0, 1, 0);
            var stamp = new THREE.Object3D();
            var batches = new Map();
            var serif = '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif';
            function paint(color, options) {
                if (options === void 0) { options = {}; }
                return new THREE.MeshStandardMaterial(__spreadValues({ color: color, roughness: 0.88 }, options));
            }
            function canvasMap(width, height, draw) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                draw(canvas.getContext("2d"), width, height);
                var map = new THREE.CanvasTexture(canvas);
                map.colorSpace = THREE.SRGBColorSpace;
                map.anisotropy = 8;
                return map;
            }
            function speckle(ctx, width, height, amount, seed) {
                for (var i = 0; i < amount; i++) {
                    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
                    var x = seed / 4294967296 * width;
                    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
                    var y = seed / 4294967296 * height;
                    ctx.fillStyle = i % 3 ? "#2d294315" : "#fff0c21f";
                    ctx.fillRect(x, y, 1 + i % 4, 1 + i % 3);
                }
            }
            function wallMap(width, height, style) {
                return canvasMap(384, 768, function (ctx, w, h) {
                    var colors = {
                        plaster: ["#e5d9d2", "#bca7a03b", "#88695955"],
                        tile: ["#d7dbea", "#56687e79", "#52657d30"],
                        glazed: ["#d1ddd0", "#586c6b64", "#60736547"],
                        brick: ["#d9c1b1", "#644b516c", "#8e51563c"]
                    }[style];
                    ctx.fillStyle = colors[0];
                    ctx.fillRect(0, 0, w, h);
                    if (style === "plaster") {
                        for (var i = 0; i < 34; i++) {
                            var x = (29 + 97 * i) % w;
                            var y = (13 + 199 * i) % h;
                            var cloud = ctx.createRadialGradient(x, y, 2, x, y, 23 + i % 4 * 7);
                            cloud.addColorStop(0, i % 3 ? "#9c79622a" : "#fff2d050");
                            cloud.addColorStop(1, "#aa978b00");
                            ctx.fillStyle = cloud;
                            ctx.fillRect(x - 52, y - 52, 104, 104);
                        }
                    }
                    speckle(ctx, w, h, 2400, 356);
                    var stain = ctx.createLinearGradient(0, 0, 0, h);
                    stain.addColorStop(0, colors[2]);
                    stain.addColorStop(0.18, "#1e244300");
                    stain.addColorStop(0.89, "#1e244300");
                    stain.addColorStop(1, "#40335137");
                    ctx.fillStyle = stain;
                    ctx.fillRect(0, 0, w, h);
                    for (var i = 0; i < 21; i++) {
                        var x = (13 + 71 * i) % w;
                        var end = 23 + i % 7 * 11;
                        var runoff = ctx.createLinearGradient(0, 0, 0, end);
                        runoff.addColorStop(0, "#5b4d5550");
                        runoff.addColorStop(1, "#5b4d5500");
                        ctx.fillStyle = runoff;
                        ctx.fillRect(x, 0, 1.5 + i % 4, end);
                    }
                });
            }
            function instance(group, geometry, finish, position, scale, rotation, cast) {
                var _d, _e;
                var finishId = Array.isArray(finish) ? finish.map(function (material2) { return material2.id; }).join(",") : finish.id;
                var key = "".concat(group.id, ":").concat(geometry.id, ":").concat(finishId, ":").concat(cast);
                if (!batches.has(key))
                    batches.set(key, { group: group, geometry: geometry, finish: finish, cast: cast, matrices: [] });
                (_d = stamp.position).set.apply(_d, __spreadArray([], __read(position), false));
                (_e = stamp.scale).set.apply(_e, __spreadArray([], __read(scale), false));
                stamp.quaternion.copy(rotation);
                stamp.updateMatrix();
                batches.get(key).matrices.push(stamp.matrix.clone());
            }
            function box2(group, finish, x, y, z, w, h, d, cast) {
                if (cast === void 0) { cast = true; }
                instance(group, sharedBox, finish, [x, y, z], [w, h, d], identity, cast);
            }
            function pipe(group, finish, start, end, radius, cast) {
                var _d, _e;
                if (cast === void 0) { cast = true; }
                var a = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(start), false)))();
                var b = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(end), false)))();
                var span = b.clone().sub(a);
                var length = span.length();
                var rotation = new THREE.Quaternion().setFromUnitVectors(up, span.normalize());
                instance(group, sharedDrum, finish, a.lerp(b, 0.5).toArray(), [radius, length, radius], rotation, cast);
            }
            function panel(group, finish, x, y, z, width, height) {
                var mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), finish);
                mesh.position.set(x, y, z);
                mesh.receiveShadow = !finish.transparent;
                group.add(mesh);
            }
            var roomLight = {
                dusk: ["#92b9e9", 0.2, -0.25, -0.12],
                lamp: ["#ffc183", 0.72, -0.28, -0.02],
                blinds: ["#adc5ec", 0.22, 0.17, 0.09],
                curtains: ["#ffb59a", 0.47, 0.21, -0.03],
                kitchen: ["#ffe1ac", 0.54, 0.17, 0.04],
                books: ["#f4bb8e", 0.47, -0.2, 0.11],
                pharmacy: ["#bfe5df", 0.55, 0.03, 0.15],
                plant: ["#ffd3a7", 0.43, -0.16, 0.19]
            };
            function roomGeometry(face, mode, x, y, width, height) {
                var e_262, _d, e_263, _e;
                if (face.userData.sharedShop && y < 2.25)
                    return;
                var variant = Math.abs(Math.floor(x * 31 + y * 17)) % 3;
                var z = [-0.48, -0.39, -0.44][variant];
                var roomWall = mode === "pharmacy" ? roomWallGreen : mode === "dusk" || mode === "blinds" ? roomWallCool : roomWallWarm;
                var roomDepth = 0.6;
                var sideWidth = Math.max(0.035, width * 0.045);
                box2(face, roomWall, x, y, -0.58, width * 0.91, height * 0.91, 0.022, false);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        box2(face, roomWall, x + side * width * 0.46, y, -0.28, sideWidth, height * 0.98, roomDepth, false);
                    }
                }
                catch (e_262_1) { e_262 = { error: e_262_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_262) throw e_262.error; }
                }
                box2(face, roomWall, x, y + height * 0.47, -0.28, width * 0.94, height * 0.06, roomDepth, false);
                box2(face, darkWood, x, y - height * 0.47, -0.28, width * 0.94, height * 0.06, roomDepth, false);
                var _h = __read(roomLight[mode], 4), tint = _h[0], strength = _h[1], offset = _h[2], rise = _h[3];
                var washWidth = width * (0.88 - Math.abs(offset) * 1.22);
                var washHeight = height * (0.87 - Math.abs(rise) * 1.28);
                lightPaint2.add(face, [x + offset * width * 0.6, y + rise * height * 0.61, -0.564], [washWidth, washHeight], tint, strength);
                lightPaint2.add(face, [x + offset * 0.64 * width, y - height * 0.44 + 5e-3, -0.32], [width * 0.66, 0.45], tint, strength * 0.66, true);
                var detail = function (finish, px, py, pz, w, h, d) {
                    if (d === void 0) { d = 0.035; }
                    return box2(face, finish, x + px * width, y + py * height, z + pz * 0.59, w * width, h * height, d * 0.72, false);
                };
                if (mode === "blinds") {
                    for (var i = 0; i < 8; i++)
                        detail(i % 2 ? pearl : trimBlue, 0, (i - 1) * 0.105, 0.018, 0.94, 0.026, 0.025);
                    detail(screen, 0.43, 0, 0.025, 0.018, 0.91, 0.03);
                    detail(darkWood, -0.03, -0.25, 0.095, 0.64, 0.055, 0.21);
                    detail(wood, -0.03, -0.12, 0.1, 0.58, 0.22, 0.21);
                    detail(lampGlass, 0.28, -0.08, 0.17, 0.075, 0.065, 0.055);
                }
                else if (mode === "books" || mode === "pharmacy") {
                    var pharmacy = mode === "pharmacy";
                    detail(pharmacy ? trimGreen : darkWood, 0, 0.02, 8e-3, 0.92, 0.69, 0.045);
                    for (var shelf = 0; shelf < (pharmacy ? 3 : 2 + variant); shelf++) {
                        var sy = -0.29 + shelf * 0.25;
                        detail(pharmacy ? pearl : wood, 0, sy, 0.075, 0.97, 0.035, 0.12);
                        var px = -0.43;
                        for (var i = 0; i < 8; i++) {
                            var bw = 0.052 + i % 3 * 0.012, bh = 0.19 + (i * 7 + shelf * 3 + variant) % 5 * 0.026;
                            var hue = pharmacy ? [pearl, trimGreen, ochre, blueFrame][i % 4] : [rust, ochre, wood, trimBlue][(i + shelf) % 4];
                            detail(hue, px + bw / 2, sy + 0.035 + bh / 2, 0.105, bw, bh, 0.085);
                            px += bw + 0.012;
                        }
                    }
                }
                else if (mode === "kitchen") {
                    detail(wood, 0, 0.26, 0.025, 0.88, 0.37, 0.15);
                    for (var i = -1; i <= 1; i++) {
                        detail(warmFrame, i * 0.29, 0.26, 0.094, 0.018, 0.33, 0.025);
                        detail(ochre, i * 0.29, 0.26, 0.11, 0.012, 0.035, 0.028);
                    }
                    detail(pearl, 0, -0.035, 0.095, 0.95, 0.055, 0.22);
                    detail(screen, -0.13, -0.22, 0.09, 0.38, 0.23, 0.18);
                    detail(zinc, 0.24, -0.19, 0.18, 0.25, 0.07, 0.15);
                    pipe(face, zinc, [x + 0.32 * width, y - 0.11 * height, z + 0.1], [x + 0.32 * width, y - 0.16 * height, z + 0.1], 0.014, false);
                    detail(wood, -0.28, -0.27, 0.12, 0.28, 0.07, 0.18);
                    for (var i = 0; i < 3; i++)
                        detail(i % 2 ? pearl : ochre, -0.36 + i * 0.08, -0.19, 0.17, 0.045, 0.1, 0.08);
                }
                else if (mode === "curtains") {
                    try {
                        for (var _j = __values([-1, 1]), _k = _j.next(); !_k.done; _k = _j.next()) {
                            var side = _k.value;
                            for (var i = 0; i < 4; i++) {
                                var px = side * (0.43 - i * 0.047);
                                detail(i % 2 ? linenRose : linenCream, px, 0.01, 0.06, 0.12, 0.98, 0.05);
                            }
                        }
                    }
                    catch (e_263_1) { e_263 = { error: e_263_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                        }
                        finally { if (e_263) throw e_263.error; }
                    }
                    detail(oldIron, 0, 0.46, 0.02, 0.95, 0.025, 0.035);
                    detail(darkWood, 0, -0.27, 0.1, 0.72, 0.12, 0.2);
                    detail(variant === 1 ? linenCream : wood, 0, -0.2, 0.13, 0.62, 0.08, 0.24);
                    detail(lampGlass, 0.31, -0.12, 0.17, 0.07, 0.05, 0.06);
                }
                else if (mode === "plant") {
                    detail(darkWood, 0, -0.28, 0.06, 0.68, 0.055, 0.2);
                    detail(variant === 1 ? linenCream : wood, -0.2, -0.16, 0.11, 0.34, 0.19, 0.2);
                    detail(potClay, 0, -0.05, 0.12, 0.18, 0.18, 0.16);
                    for (var i = 0; i < 6; i++) {
                        var px = -0.2 + i % 3 * 0.08, py = 0.08 + Math.floor(i / 3) * 0.11;
                        pipe(face, foliage[0], [x, y - 0.02 * height, z + 0.08], [x + px * width, y + py * height, z + 0.11], 9e-3, false);
                        instance(face, sharedLeaf, foliage[i % foliage.length], [x + px * width, y + py * height, z + 0.13], [0.07 * width, 0.027 * height, 0.035], identity, false);
                    }
                }
                else if (mode === "lamp" || mode === "dusk") {
                    var bed = mode === "lamp";
                    detail(darkWood, bed ? -0.08 : 0.05, -0.29, 0.06, bed ? 0.76 : 0.81, 0.075, 0.25);
                    detail(bed ? linenCream : blueFrame, bed ? -0.08 : 0.05, -0.22, 0.11, bed ? 0.68 : 0.7, 0.09, 0.26);
                    detail(bed ? warmFrame : darkWood, bed ? -0.4 : 0.05, -0.08, 0.08, 0.07, 0.42, 0.18);
                    if (!bed) {
                        detail(darkWood, 0.23, -0.08, 0.09, 0.34, 0.3, 0.18);
                        detail(ochre, 0.23, 0.09, 0.14, 0.24, 0.08, 0.12);
                    }
                    detail(darkWood, -0.32, -0.12, 0.12, 0.055, 0.31, 0.08);
                    instance(face, sharedPot, gold, [x - 0.32 * width, y + 0.1 * height, z + 0.13], [0.12 * width, 0.105 * height, 0.09], identity, false);
                    detail(lampGlass, -0.32, 0.04, 0.17, 0.12, 0.04, 0.08);
                }
            }
            var graphite = paint("#353a47");
            var duct = paint("#5b6270", { metalness: 0.19 });
            var oldIron = paint("#696974", { metalness: 0.16 });
            var rust = paint("#704951");
            var pearl = paint("#afb0ad");
            var screen = paint("#1a273a");
            var copper = paint("#716367");
            var roof = paint("#403c4e");
            var zinc = paint("#6f8187", { metalness: 0.19 });
            var zincSeam = paint("#8b9b9b", { metalness: 0.32 });
            var glazedCaps = paint("#6c8a80", { roughness: 0.62, metalness: 0.1 });
            var trimWarm = paint("#bd9f86");
            var trimBlue = paint("#8999aa");
            var trimGreen = paint("#92a797");
            var roomWallWarm = paint("#6d4e58", { roughness: 0.94 });
            var roomWallCool = paint("#45566d", { roughness: 0.94 });
            var roomWallGreen = paint("#52685f", { roughness: 0.94 });
            var warmFrame = paint("#987b70");
            var blueFrame = paint("#718394");
            var darkWood = paint("#513b46");
            var wood = paint("#b67b5b");
            var ochre = paint("#c69e6a");
            var gold = paint("#fdbd78", { emissive: "#ff9951", emissiveIntensity: 1.5 });
            var lampGlass = paint("#ffe5bd", { emissive: "#ffb678", emissiveIntensity: 2 });
            var roomStyles = {
                dusk: ["#658bb0", "#293852", 0.24],
                lamp: ["#c68a6c", "#e3ae7d", 0.83],
                blinds: ["#9cadc3", "#405b78", 0.27],
                curtains: ["#eecb91", "#f3c5a7", 0.95],
                kitchen: ["#b47960", "#f6bd91", 0.8],
                books: ["#976855", "#ddaa7b", 0.82],
                pharmacy: ["#91aa94", "#e5d8ad", 0.75],
                plant: ["#caac9a", "#edca91", 0.76]
            };
            function apartmentWindow(mode, _d) {
                var _e = __read(_d, 3), top = _e[0], bottom = _e[1], emission = _e[2];
                var map = canvasMap(320, 256, function (ctx, w, h) {
                    var wash = ctx.createLinearGradient(w * 0.19, 0, w * 0.7, h);
                    wash.addColorStop(0, top);
                    wash.addColorStop(1, bottom);
                    var rect = function (color, x, y, width, height) {
                        ctx.fillStyle = color;
                        ctx.fillRect(x, y, width, height);
                    };
                    var shape = function (color, points) {
                        ctx.fillStyle = color;
                        ctx.beginPath();
                        points.forEach(function (_d, i) {
                            var _e = __read(_d, 2), x = _e[0], y = _e[1];
                            return i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                        });
                        ctx.closePath();
                        ctx.fill();
                    };
                    rect(wash, 0, 0, w, h);
                    var glow = ctx.createLinearGradient(0, 0, 0, h);
                    glow.addColorStop(0, "#f8ddb22a");
                    glow.addColorStop(0.48, "#f8ddb208");
                    glow.addColorStop(1, "#18243b58");
                    rect(glow, 0, 0, w, h);
                    shape("#ffffff24", [[0, 18], [320, 103], [320, 113], [0, 29]]);
                    speckle(ctx, w, h, 240, 3941);
                    var vignette = ctx.createLinearGradient(0, 0, 0, h);
                    vignette.addColorStop(0, "#171d376f");
                    vignette.addColorStop(0.18, "#171d3700");
                    vignette.addColorStop(1, "#171d3700");
                    rect(vignette, 0, 0, w, h);
                });
                return paint(16777215, { map: map, emissiveMap: map, emissive: 16777215, emissiveIntensity: emission * 1.85, roughness: 0.45, transparent: true, opacity: 0.18, depthWrite: false });
            }
            var glass = Object.fromEntries(Object.entries(roomStyles).map(function (_d) {
                var _e = __read(_d, 2), name = _e[0], style = _e[1];
                return [name, apartmentWindow(name, style)];
            }));
            var roomCycle = [glass.dusk, glass.lamp, glass.blinds, glass.curtains, glass.kitchen];
            var storefrontGlass = new THREE.MeshPhysicalMaterial({
                color: "#d7e2e5",
                roughness: 0.18,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                specularIntensity: 0.58
            });
            var openingTrimGroups = new WeakMap();
            function openingTrim(face) {
                var trim = openingTrimGroups.get(face);
                if (!trim) {
                    trim = new THREE.Group();
                    trim.userData.windowAndDoorTrim = true;
                    face.add(trim);
                    openingTrimGroups.set(face, trim);
                }
                return trim;
            }
            function windowUnit(face, x, y, width, height, lit, rim, transom) {
                var e_264, _d, e_265, _e;
                if (transom === void 0) { transom = 0.22; }
                var joinery = openingTrim(face);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        box2(joinery, rim, x + side * (width / 2 + 0.034), y, -0.045, 0.068, height + 0.13, 0.16);
                        box2(joinery, rim, x, y + side * (height / 2 + 0.034), -0.045, width, 0.068, 0.16);
                    }
                }
                catch (e_264_1) { e_264 = { error: e_264_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_264) throw e_264.error; }
                }
                var mode = typeof lit === "string" ? lit : ["dusk", "lamp", "blinds", "curtains", "kitchen"][lit % 5];
                roomGeometry(face, mode, x, y, width, height);
                var pane = face.userData.sharedShop && y < 2.25 ? storefrontGlass : glass[lit] || roomCycle[lit];
                panel(face, pane, x, y, 6e-3, width - 9e-3, height - 9e-3);
                box2(joinery, rim, x, y, 0.026, 0.046, height + 0.018, 0.028);
                if (transom !== null) {
                    var railWidth = (width - 0.046) / 2;
                    try {
                        for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var side = _j.value;
                            box2(joinery, rim, x + side * (0.023 + railWidth / 2), y + height * transom, 0.026, railWidth, 0.035, 0.028);
                        }
                    }
                    catch (e_265_1) { e_265 = { error: e_265_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                        }
                        finally { if (e_265) throw e_265.error; }
                    }
                }
                box2(joinery, pearl, x, y - height * 0.5 - 0.059, 0.14, width + 0.19, 0.044, 0.237);
                box2(joinery, rim, x + 0.07, y - height * 0.1, 0.053, 0.082, 0.029, 0.034, false);
            }
            function entrance(face, x, threshold, width, height, tint, light, sliding) {
                if (tint === void 0) { tint = graphite; }
                if (light === void 0) { light = 1; }
                if (sliding === void 0) { sliding = false; }
                var joinery = openingTrim(face);
                var center = threshold + height / 2;
                box2(joinery, tint, x - width / 2 - 0.015, center, 0.015, 0.075, height + 0.075, 0.16);
                box2(joinery, tint, x + width / 2 + 0.015, center, 0.015, 0.075, height + 0.075, 0.16);
                box2(joinery, tint, x, threshold + height + 0.022, 0.015, width - 0.045, 0.075, 0.16);
                var glazedWidth = width - 0.16, glazedHeight = height - 0.31, glazedY = center + 0.125;
                var mode = typeof light === "string" ? light : ["dusk", "lamp", "blinds", "curtains", "kitchen"][light % 5];
                roomGeometry(face, mode, x, glazedY, glazedWidth, glazedHeight);
                var pane = face.userData.sharedShop && glazedY < 2.25 ? storefrontGlass : glass[light] || roomCycle[light];
                panel(face, pane, x, glazedY + 0.012, 6e-3, glazedWidth, glazedHeight - 0.024);
                box2(joinery, tint, x, threshold + 0.133, 0.025, width - 0.09, 0.218, 0.043);
                box2(joinery, pearl, x, threshold + 0.027, 0.062, width + 0.1, 0.037, 0.148);
                if (sliding)
                    box2(joinery, tint, x, center + 0.043, 0.029, 0.042, height - 0.055, 0.032);
                box2(joinery, pearl, x + (sliding ? -0.08 : width * 0.32), center - 0.092, 0.052, 0.039, 0.13, 0.043);
            }
            function doorstep(face, x, threshold, width, finish, start) {
                if (finish === void 0) { finish = pearl; }
                if (start === void 0) { start = 0; }
                var trim = openingTrim(face);
                box2(trim, finish, x, threshold * 0.24, start + 0.367, width + 0.2, threshold * 0.52, 0.734, false);
                box2(trim, finish, x, threshold * 0.75, start + 0.24, width + 0.13, threshold * 0.5, 0.48, false);
            }
            function acUnit(face, x, y, drainSide) {
                var e_266, _d;
                if (drainSide === void 0) { drainSide = 1; }
                box2(face, oldIron, x, y - 0.246, 0.187, 0.68, 0.058, 0.52);
                try {
                    for (var _e = __values([-0.235, 0.235]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var dx = _f.value;
                        box2(face, oldIron, x + dx, y - 0.39, 0.046, 0.38, 0.075);
                        pipe(face, oldIron, [x + dx, y - 0.56, 0.07], [x + dx, y - 0.273, 0.382], 0.024);
                    }
                }
                catch (e_266_1) { e_266 = { error: e_266_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_266) throw e_266.error; }
                }
                box2(face, pearl, x, y, 0.195, 0.65, 0.48, 0.37);
                pipe(face, duct, [x - 0.105, y, 0.38], [x - 0.105, y, 0.408], 0.151, false);
                pipe(face, graphite, [x - 0.105, y, 0.405], [x - 0.105, y, 0.43], 0.119, false);
                for (var i = -2; i <= 2; i++)
                    box2(face, duct, x - 0.105, y + i * 0.036, 0.438, 0.2 - Math.abs(i) * 0.022, 0.01, 0.012, false);
                for (var i = 0; i < 4; i++)
                    box2(face, duct, x + 0.175, y - 0.09 + i * 0.054, 0.392, 0.135, 0.014, 0.019, false);
                pipe(face, copper, [x + drainSide * 0.26, y - 0.215, 0.3], [x + drainSide * 0.4, y - 0.32, 0.19], 0.018);
                pipe(face, copper, [x + drainSide * 0.4, y - 0.32, 0.19], [x + drainSide * 0.49, y - 0.35, 0.063], 0.018);
            }
            function drainGrate(face, x, z) {
                var e_267, _d;
                box2(face, graphite, x, 6e-3, z, 0.18, 0.016, 0.16, false);
                try {
                    for (var _e = __values([-0.058, -0.029, 0, 0.029, 0.058]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var dx = _f.value;
                        box2(face, duct, x + dx, 0.015, z, 0.013, 9e-3, 0.133, false);
                    }
                }
                catch (e_267_1) { e_267 = { error: e_267_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_267) throw e_267.error; }
                }
            }
            function condensateDrain(face, x, y) {
                pipe(face, copper, [x, y, 0.063], [x, 0.13, 0.063], 0.018);
                pipe(face, copper, [x, 0.13, 0.063], [x, 0.046, 0.129], 0.018);
                drainGrate(face, x, 0.13);
            }
            function balcony(face, x, floor, width, depth) {
                var e_268, _d, e_269, _e;
                if (depth === void 0) { depth = 0.6; }
                var height = 0.8;
                box2(face, oldIron, x, floor - 0.057, depth / 2 - 0.018, width, 0.114, depth + 0.06);
                box2(face, duct, x, floor + height, depth, width + 0.06, 0.064, 0.06);
                for (var i = 0; i <= 9; i++) {
                    box2(face, oldIron, x + width * (i / 9 - 0.5), floor + height / 2, depth, 0.032, height, 0.039);
                }
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        var edge = x + side * width * 0.5;
                        box2(face, duct, edge, floor + height, depth * 0.51, 0.051, 0.055, depth);
                        try {
                            for (var _h = (e_269 = void 0, __values([0.09, depth * 0.49])), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var z = _j.value;
                                box2(face, oldIron, edge, floor + height / 2, z, 0.032, height, 0.034);
                            }
                        }
                        catch (e_269_1) { e_269 = { error: e_269_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                            }
                            finally { if (e_269) throw e_269.error; }
                        }
                        pipe(face, oldIron, [edge, floor - 0.31, 0.03], [edge, floor - 0.096, depth - 0.078], 0.026);
                    }
                }
                catch (e_268_1) { e_268 = { error: e_268_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_268) throw e_268.error; }
                }
            }
            var potClay = paint("#bc775d");
            var potGlaze = paint("#65978f", { roughness: 0.49 });
            var potSoil = paint("#514348");
            var foliage = ["#567a6d", "#809862", "#a1a274"].map(function (color) { return paint(color); });
            var petals2 = ["#d36787", "#dda081", "#f5c69c"].map(function (color) { return paint(color); });
            var linenRose = paint("#ba7b82", { side: THREE.DoubleSide });
            var linenCream = paint("#ead4b5", { side: THREE.DoubleSide });
            function planter(face, x, y, z, size, flower, finish) {
                if (flower === void 0) { flower = true; }
                if (finish === void 0) { finish = potClay; }
                instance(face, sharedPot, finish, [x, y + 0.11 * size, z], [0.125 * size, 0.22 * size, 0.125 * size], identity, true);
                instance(face, sharedDrum, finish, [x, y + 0.21 * size, z], [0.135 * size, 0.061 * size, 0.135 * size], identity, true);
                instance(face, sharedDrum, potSoil, [x, y + 0.239 * size, z], [0.114 * size, 7e-3 * size, 0.114 * size], identity, false);
                for (var i = 0; i < 7; i++) {
                    var angle = i * 2.399;
                    var spread = (0.032 + i % 3 * 0.026) * size;
                    var high = (0.34 + i % 4 * 0.05) * size;
                    var stem = [x + Math.cos(angle) * spread, y + high, z + Math.sin(angle) * spread];
                    pipe(face, foliage[0], [x, y + 0.224 * size, z], stem, 9e-3 * size, false);
                    instance(face, sharedLeaf, foliage[i % 3], [stem[0], stem[1] - 0.025 * size, stem[2]], [0.065 * size, 0.029 * size, 0.052 * size], identity, false);
                    if (flower && i % 2 === 0)
                        instance(face, sharedLeaf, petals2[i % 3], stem, [0.044 * size, 0.041 * size, 0.039 * size], identity, false);
                }
            }
            function towel(face, finish, x, y, z, width, length, phase) {
                var cloth = new THREE.PlaneGeometry(width, length, 12, 12);
                var vertices = cloth.attributes.position;
                for (var i = 0; i < vertices.count; i++) {
                    var px = vertices.getX(i);
                    var py = vertices.getY(i);
                    var pct = py / length + 0.5;
                    var top = Math.pow(pct, 8);
                    var fold = Math.sin((px / width + 0.5) * Math.PI * 5 + phase) * 0.021;
                    vertices.setXYZ(i, px, py + Math.cos(px / width * 8 + phase) * 0.017 * (1 - pct), fold * (1 - top) - top * 0.065);
                }
                cloth.computeVertexNormals();
                var hanging = new THREE.Mesh(cloth, finish);
                hanging.position.set(x, y - length / 2 + 0.025, z + 0.061);
                face.add(hanging);
            }
            function wallLamp(face, x, y) {
                box2(face, oldIron, x, y, 0.12, 0.11, 0.16, 0.11);
                pipe(face, oldIron, [x, y + 0.04, 0.17], [x, y - 0.04, 0.37], 0.022);
                instance(face, sharedPot, oldIron, [x, y - 0.071, 0.36], [0.13, 0.105, 0.13], identity, true);
                pipe(face, lampGlass, [x, y - 0.135, 0.36], [x, y - 0.094, 0.36], 0.075, false);
                lightPaint2.add(face, [x, y - 0.25, 0.058], [1.04, 1.22], "#ffc08b", 0.38);
                lightPaint2.add(face, [x, 3e-3, 0.75], [1.47, 1.06], "#ffc591", 0.24, true);
            }
            function roofSeams(group, width, depth, y, angle) {
                var e_270, _d, e_271, _e;
                var half = width / 2;
                var slopeWidth = (half + 0.02) / Math.cos(angle);
                var ridge = y + Math.tan(angle) * half;
                var gable = new THREE.Shape();
                gable.moveTo(-half + 0.13, 0);
                gable.lineTo(0, ridge - y - 0.015);
                gable.lineTo(half - 0.13, 0);
                gable.closePath();
                var core = new THREE.Mesh(new THREE.ExtrudeGeometry(gable, { depth: depth - 0.24, bevelEnabled: false }), warmFrame);
                core.position.set(0, y - 0.025, -depth / 2 + 0.12);
                core.castShadow = true;
                core.receiveShadow = true;
                group.add(core);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var direction = _g.value;
                        var rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -direction * angle);
                        var midX = direction * half / 2;
                        var midY = (ridge + y) / 2;
                        instance(group, sharedBox, zinc, [midX, midY, 0], [slopeWidth, 0.09, depth], rotation, true);
                        for (var i = 0; i < 7; i++) {
                            var x = i * half / 6.6;
                            box2(group, zincSeam, direction * x, ridge - Math.tan(angle) * x + 0.055, 0, 0.028, 0.036, depth + 0.014, false);
                        }
                        box2(group, warmFrame, direction * half, y - 0.029, 0, 0.081, 0.104, depth + 0.02);
                        try {
                            for (var _h = (e_271 = void 0, __values([-(depth - 0.045) / 2, (depth - 0.045) / 2])), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var z = _j.value;
                                instance(group, sharedBox, zincSeam, [midX, midY - 0.01, z], [slopeWidth, 0.092, 0.053], rotation, true);
                            }
                        }
                        catch (e_271_1) { e_271 = { error: e_271_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                            }
                            finally { if (e_271) throw e_271.error; }
                        }
                    }
                }
                catch (e_270_1) { e_270 = { error: e_270_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_270) throw e_270.error; }
                }
                pipe(group, zincSeam, [0, ridge + 0.065, -depth / 2], [0, ridge + 0.065, depth / 2], 0.052);
            }
            function shopCanopy(face, x, y, width, depth, finish, stripe) {
                var e_272, _d;
                var angle = 0.24;
                var rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
                var z = depth / 2 + 0.05;
                instance(face, sharedBox, finish, [x, y, z], [width, 0.077, depth], rotation, true);
                for (var i = 1; i < 10; i += 2) {
                    var lane = x + width * (i / 10 - 0.5);
                    instance(face, sharedBox, stripe, [lane, y + 0.043, z], [width / 10, 0.011, depth * 0.995], rotation, false);
                }
                box2(face, finish, x, y - Math.sin(angle) * depth / 2 - 0.065, depth + 0.036, width, 0.145, 0.055);
                for (var i = 1; i < 10; i += 2)
                    box2(face, stripe, x + width * (i / 10 - 0.5), y - Math.sin(angle) * depth / 2 - 0.065, depth + 0.066, width / 10, 0.146, 0.01, false);
                try {
                    for (var _e = __values([-0.42, 0.42]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var dx = _f.value;
                        pipe(face, oldIron, [x + width * dx, y - 0.33, 0.05], [x + width * dx, y - 0.095, depth * 0.73], 0.023);
                    }
                }
                catch (e_272_1) { e_272 = { error: e_272_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_272) throw e_272.error; }
                }
            }
            function downspout(face, x, outlet, reach) {
                if (reach === void 0) { reach = 0.09; }
                pipe(face, copper, [x, outlet, reach], [x, outlet - 0.21, 0.089], 0.038);
                pipe(face, copper, [x, outlet - 0.21, 0.089], [x, 0.17, 0.089], 0.038);
                pipe(face, copper, [x, 0.17, 0.089], [x, 0.068, 0.2], 0.038);
                for (var y = 0.63; y < outlet - 0.3; y += 1.42)
                    box2(face, graphite, x, y, 0.075, 0.097, 0.043, 0.11);
                drainGrate(face, x, 0.2);
            }
            function signMap(_d) {
                var title = _d.title, subtitle = _d.subtitle, bg = _d.bg, ink = _d.ink, stripe = _d.stripe, vertical = _d.vertical;
                return canvasMap(vertical ? 144 : 620, vertical ? 620 : 144, function (ctx, w, h) {
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, w, h);
                    ctx.strokeStyle = stripe;
                    ctx.lineWidth = 5;
                    ctx.strokeRect(10, 10, w - 20, h - 20);
                    ctx.strokeStyle = ink;
                    ctx.lineWidth = 1.6;
                    ctx.strokeRect(17, 17, w - 34, h - 34);
                    ctx.fillStyle = ink;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = "700 ".concat(vertical ? 71 : 66, "px ").concat(serif);
                    if (vertical) {
                        __spreadArray([], __read(title), false).forEach(function (glyph, i) { return ctx.fillText(glyph, w / 2, 82 + i * (h - 206) / Math.max(1, title.length - 1)); });
                        ctx.font = "600 17px sans-serif";
                        ctx.fillText(subtitle, w / 2, h - 49);
                    }
                    else {
                        ctx.fillText(title, w / 2, 59);
                        ctx.font = "700 17px sans-serif";
                        ctx.fillText(subtitle, w / 2, 110);
                    }
                    speckle(ctx, w, h, 680, 421);
                });
            }
            function sign(face, x, y, width, height, graphic, depth, power) {
                if (depth === void 0) { depth = 0.12; }
                if (power === void 0) { power = 1.35; }
                var map = signMap(graphic);
                var shell = paint("#414250", { metalness: 0.22 });
                var print = paint(16777215, { map: map, emissiveMap: map, emissive: 16777215, emissiveIntensity: power, roughness: 0.55 });
                box2(face, shell, x, y, depth, width + 0.105, height + 0.095, 0.14);
                panel(face, print, x, y, depth + 0.074, width, height);
            }
            function antenna(group, x, y, z, width) {
                box2(group, duct, x, y + 0.019, z, 0.13, 0.038, 0.12);
                pipe(group, duct, [x, y, z], [x, y + 0.81, z], 0.022);
                pipe(group, duct, [x - width * 0.5, y + 0.74, z], [x + width * 0.5, y + 0.74, z], 0.012);
                for (var i = -2; i <= 2; i++) {
                    var span = 0.12 + (2 - i) * 0.045;
                    pipe(group, duct, [x + i * 0.13, y + 0.739, z - span], [x + i * 0.13, y + 0.739, z + span], 0.011, false);
                }
            }
            function tank(group, x, y, z, size) {
                var e_273, _d, e_274, _e, e_275, _f;
                var finish = paint("#82748c", { metalness: 0.33, roughness: 0.57 });
                try {
                    for (var _g = __values([-0.29, 0.29]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var dx = _h.value;
                        try {
                            for (var _j = (e_274 = void 0, __values([-0.24, 0.24])), _k = _j.next(); !_k.done; _k = _j.next()) {
                                var dz = _k.value;
                                box2(group, pearl, x + dx * size, y + 0.03, z + dz * size, 0.16, 0.06, 0.15);
                                box2(group, duct, x + dx * size, y + 0.22 * size + 0.02, z + dz * size, 0.054, 0.38 * size, 0.055);
                            }
                        }
                        catch (e_274_1) { e_274 = { error: e_274_1 }; }
                        finally {
                            try {
                                if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                            }
                            finally { if (e_274) throw e_274.error; }
                        }
                    }
                }
                catch (e_273_1) { e_273 = { error: e_273_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_273) throw e_273.error; }
                }
                try {
                    for (var _l = __values([-1, 1]), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var sx = _m.value;
                        pipe(group, duct, [x + sx * 0.29 * size, y + 0.1, z - 0.24 * size], [x + sx * 0.29 * size, y + 0.37 * size, z + 0.24 * size], 0.022);
                    }
                }
                catch (e_275_1) { e_275 = { error: e_275_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                    }
                    finally { if (e_275) throw e_275.error; }
                }
                box2(group, graphite, x, y + 0.41 * size, z, 0.85 * size, 0.065, 0.83 * size);
                pipe(group, finish, [x, y + 0.41 * size + 0.031, z], [x, y + 0.96 * size, z], 0.38 * size);
                pipe(group, duct, [x, y + 0.96 * size, z], [x, y + 1.02 * size, z], 0.4 * size);
                pipe(group, pearl, [x, y + 0.65 * size, z], [x, y + 0.685 * size, z], 0.383 * size);
                pipe(group, duct, [x, y + 1.02 * size, z], [x, y + 1.064 * size, z], 0.16 * size);
                pipe(group, duct, [x + 0.36 * size, y + 0.57 * size, z], [x + 0.53 * size, y + 0.57 * size, z], 0.026);
                pipe(group, duct, [x + 0.53 * size, y + 0.57 * size, z], [x + 0.53 * size, y + 0.075, z], 0.026);
                pipe(group, duct, [x + 0.53 * size, y + 0.075, z], [x + 0.53 * size, y, z - 0.17], 0.026);
                box2(group, pearl, x + 0.53 * size, y + 0.029, z - 0.17, 0.13, 0.058, 0.13);
                pipe(group, copper, [x + 0.53 * size, y + 0.38 * size, z - 0.079], [x + 0.53 * size, y + 0.38 * size, z + 0.079], 0.018);
            }
            function roofHatch(group, x, y, z, cover) {
                var e_276, _d, e_277, _e;
                box2(group, graphite, x, y + 0.085, z, 0.83, 0.17, 0.96);
                box2(group, cover, x, y + 0.192, z, 0.91, 0.052, 1.03);
                try {
                    for (var _f = __values([-0.25, 0.25]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var dx = _g.value;
                        box2(group, duct, x + dx, y + 0.216, z - 0.45, 0.097, 0.036, 0.082);
                    }
                }
                catch (e_276_1) { e_276 = { error: e_276_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_276) throw e_276.error; }
                }
                try {
                    for (var _h = __values([-0.08, 0.08]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var dx = _j.value;
                        box2(group, duct, x + dx, y + 0.242, z + 0.29, 0.026, 0.052, 0.029);
                    }
                }
                catch (e_277_1) { e_277 = { error: e_277_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_277) throw e_277.error; }
                }
                pipe(group, duct, [x - 0.08, y + 0.27, z + 0.29], [x + 0.08, y + 0.27, z + 0.29], 0.016);
            }
            function facadeWithOpenings(face, span, height, finish, openings) {
                var e_278, _d;
                var levels = [0, height];
                try {
                    for (var openings_2 = __values(openings), openings_2_1 = openings_2.next(); !openings_2_1.done; openings_2_1 = openings_2.next()) {
                        var _e = __read(openings_2_1.value, 4), y = _e[1], h = _e[3];
                        levels.push(THREE.MathUtils.clamp(y - h / 2, 0, height), THREE.MathUtils.clamp(y + h / 2, 0, height));
                    }
                }
                catch (e_278_1) { e_278 = { error: e_278_1 }; }
                finally {
                    try {
                        if (openings_2_1 && !openings_2_1.done && (_d = openings_2.return)) _d.call(openings_2);
                    }
                    finally { if (e_278) throw e_278.error; }
                }
                levels.sort(function (a, b) { return a - b; });
                var _loop_19 = function (i) {
                    var e_279, _f;
                    var low = levels[i], high = levels[i + 1];
                    if (high - low < 0.015)
                        return "continue";
                    var middle = (low + high) / 2;
                    var gaps = openings.filter(function (_d) {
                        var _e = __read(_d, 4), y = _e[1], h = _e[3];
                        return middle > y - h / 2 && middle < y + h / 2;
                    }).map(function (_d) {
                        var _e = __read(_d, 3), x = _e[0], w = _e[2];
                        return [Math.max(-span / 2, x - w / 2), Math.min(span / 2, x + w / 2)];
                    }).filter(function (_d) {
                        var _e = __read(_d, 2), a = _e[0], b = _e[1];
                        return b - a > 0.02;
                    }).sort(function (a, b) { return a[0] - b[0]; });
                    var cursor = -span / 2;
                    try {
                        for (var gaps_3 = (e_279 = void 0, __values(gaps)), gaps_3_1 = gaps_3.next(); !gaps_3_1.done; gaps_3_1 = gaps_3.next()) {
                            var _g = __read(gaps_3_1.value, 2), left = _g[0], right = _g[1];
                            if (left > cursor + 0.012)
                                box2(face, finish, (cursor + left) / 2, middle, -0.045, left - cursor, high - low, 0.09);
                            cursor = Math.max(cursor, right);
                        }
                    }
                    catch (e_279_1) { e_279 = { error: e_279_1 }; }
                    finally {
                        try {
                            if (gaps_3_1 && !gaps_3_1.done && (_f = gaps_3.return)) _f.call(gaps_3);
                        }
                        finally { if (e_279) throw e_279.error; }
                    }
                    if (cursor < span / 2 - 0.012)
                        box2(face, finish, (cursor + span / 2) / 2, middle, -0.045, span / 2 - cursor, high - low, 0.09);
                };
                for (var i = 0; i < levels.length - 1; i++) {
                    _loop_19(i);
                }
            }
            function furnishShop(group, width, depth, floor, pharmacy) {
                var e_280, _d, e_281, _e, e_282, _f;
                var casework = pharmacy ? trimGreen : wood;
                var backing = pharmacy ? roomWallGreen : roomWallWarm;
                var shopFloor = paint(pharmacy ? "#b1aaa0" : "#826959", { roughness: 0.9 });
                var products = pharmacy ? [pearl, trimGreen, ochre, blueFrame] : [rust, ochre, wood, trimBlue];
                var finishThickness = 0.018;
                box2(group, shopFloor, 0, floor + finishThickness / 2, 0, width - 0.16, finishThickness, depth - 0.16, false);
                box2(group, backing, 0, 2.34, 0, width - 0.16, 0.08, depth - 0.16, false);
                var rackZ = -depth / 2 + 0.42;
                var rackWidth = width - 0.75;
                box2(group, backing, 0, 1.14, rackZ - 0.16, rackWidth, 1.66, 0.055, false);
                try {
                    for (var _g = __values([-rackWidth / 2, rackWidth / 2]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var x = _h.value;
                        box2(group, casework, x, 1.14, rackZ, 0.048, 1.66, 0.35, false);
                    }
                }
                catch (e_280_1) { e_280 = { error: e_280_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_280) throw e_280.error; }
                }
                for (var row = 0; row < 4; row++) {
                    var y = 0.42 + row * 0.41;
                    box2(group, casework, 0, y, rackZ, rackWidth, 0.048, 0.37, false);
                    for (var i = 0; i < 19; i++) {
                        var x = (i - 9) * rackWidth / 20;
                        var h = 0.18 + (i * 3 + row) % 5 * 0.022;
                        var w = rackWidth / (pharmacy ? 26 : 29);
                        box2(group, products[(i + row * 3) % products.length], x, y + 0.024 + h / 2, rackZ + 0.055, w, h, 0.12, false);
                    }
                }
                var counterX = pharmacy ? -1.08 : -1.44;
                box2(group, casework, counterX, 0.6, 0.04, 0.87, 0.7, 0.6, false);
                box2(group, pearl, counterX, 0.977, 0.04, 0.94, 0.054, 0.65, false);
                box2(group, screen, counterX + 0.19, 1.087, -0.02, 0.21, 0.15, 0.13, false);
                for (var i = 0; i < 5; i++)
                    box2(group, products[i % products.length], counterX - 0.3 + i * 0.074, 1.048, 0.2, 0.063, 0.064, 0.13, false);
                var displayX = pharmacy ? -0.45 : -0.79;
                var displayZ = depth / 2 - 0.51;
                box2(group, casework, displayX, floor + 0.17, displayZ, 1.13, 0.29, 0.34, false);
                box2(group, pearl, displayX, floor + 0.334, displayZ, 1.18, 0.038, 0.38, false);
                for (var i = 0; i < 6; i++) {
                    var h = pharmacy ? 0.15 + i % 3 * 0.035 : 0.21 + i % 3 * 0.025;
                    box2(group, products[(i + 1) % products.length], displayX + (i - 2.5) * 0.168, floor + 0.353 + h / 2, displayZ, 0.133, h, pharmacy ? 0.132 : 0.057, false);
                }
                if (pharmacy) {
                    try {
                        for (var _j = __values([-0.3, 0.48]), _k = _j.next(); !_k.done; _k = _j.next()) {
                            var z = _k.value;
                            box2(group, lampGlass, -0.19, 2.27, z, 1.56, 0.045, 0.1, false);
                        }
                    }
                    catch (e_281_1) { e_281 = { error: e_281_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                        }
                        finally { if (e_281) throw e_281.error; }
                    }
                }
                else {
                    try {
                        for (var _l = __values([-0.82, 0.65]), _m = _l.next(); !_m.done; _m = _l.next()) {
                            var x = _m.value;
                            pipe(group, copper, [x, 2.29, 0.47], [x, 1.99, 0.47], 0.013, false);
                            instance(group, sharedPot, wood, [x, 1.94, 0.47], [0.18, 0.09, 0.18], identity, false);
                            box2(group, lampGlass, x, 1.889, 0.47, 0.17, 0.022, 0.16, false);
                        }
                    }
                    catch (e_282_1) { e_282 = { error: e_282_1 }; }
                    finally {
                        try {
                            if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                        }
                        finally { if (e_282) throw e_282.error; }
                    }
                }
                var light = new THREE.PointLight(pharmacy ? "#e3f5e8" : "#ffca91", 4.6, 4.2, 2);
                light.position.set(pharmacy ? -0.19 : -0.82, 2.14, pharmacy ? 0.03 : 0.6);
                group.add(light);
                var tint = pharmacy ? "#c0e8dc" : "#ffc088";
                lightPaint2.add(group, [displayX, floor + 0.358, displayZ], [1.15, 0.42], tint, 0.46, true);
                lightPaint2.add(group, [pharmacy ? 0.57 : -0.48, floor + 0.024, 0.7], [1.64, 1.59], tint, 0.39, true);
                lightPaint2.add(group, [pharmacy ? 0.86 : 1.1, 3e-3, depth / 2 + 0.75], [1.5, 1.23], tint, 0.36, true);
            }
            function makeBlock(_d) {
                var e_283, _e, e_284, _f, e_285, _g, e_286, _h, e_287, _j;
                var name = _d.name, x = _d.x, z = _d.z, width = _d.width, depth = _d.depth, height = _d.height, floors = _d.floors, color = _d.color, trim = _d.trim, rim = _d.rim, _k = _d.style, style = _k === void 0 ? "plaster" : _k, _l = _d.parapet, parapet = _l === void 0 ? true : _l, _m = _d.rearEntry, rearEntry = _m === void 0 ? false : _m, _o = _d.openings, openings = _o === void 0 ? { front: [], side: [] } : _o;
                var group = new THREE.Group();
                group.position.set(x, 0.18, z);
                group.name = name;
                parent.add(group);
                var front = new THREE.Group();
                front.position.z = depth / 2;
                var side = new THREE.Group();
                side.position.x = width / 2;
                side.rotation.y = Math.PI / 2;
                var back = new THREE.Group();
                back.position.z = -depth / 2;
                back.rotation.y = Math.PI;
                var west = new THREE.Group();
                west.position.x = -width / 2;
                west.rotation.y = -Math.PI / 2;
                group.add(front, side, back, west);
                var faceWall = paint(color, { map: wallMap(width, height, style) });
                var sideWall = paint(color, { map: wallMap(depth, height, style) });
                var emptyFace = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
                var backOpenings = [];
                var westOpenings = [];
                try {
                    for (var _p = __values(floors.entries()), _q = _p.next(); !_q.done; _q = _p.next()) {
                        var _r = __read(_q.value, 2), index = _r[0], floor = _r[1];
                        var y = floor + 1.19;
                        backOpenings.push([-width * 0.21, y, Math.min(1.18, width * 0.32), 1.24]);
                        if (index || !rearEntry)
                            backOpenings.push([width * 0.18, y, Math.min(1.12, width * 0.3), 1.22]);
                        westOpenings.push([-depth * 0.19, y, 1.21, 1.26], [depth * 0.22, y, 1.1, 1.2]);
                    }
                }
                catch (e_283_1) { e_283 = { error: e_283_1 }; }
                finally {
                    try {
                        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
                    }
                    finally { if (e_283) throw e_283.error; }
                }
                if (rearEntry)
                    backOpenings.push([0.77, floors[0] + 1.81 / 2, 0.86, 1.81]);
                var shell = [emptyFace, emptyFace, roof, graphite, emptyFace, emptyFace];
                box2(group, shell, 0, height / 2, 0, width, height, depth);
                facadeWithOpenings(front, width, height, faceWall, openings.front);
                facadeWithOpenings(side, depth, height, sideWall, openings.side);
                facadeWithOpenings(back, width, height, faceWall, backOpenings);
                facadeWithOpenings(west, depth, height, sideWall, westOpenings);
                if (style === "tile" || style === "glazed") {
                    var tileFinishes = (style === "tile" ? ["#788ba4", "#8295ad", "#899bb1", "#71849c"] : ["#788f83", "#82998c", "#899e91", "#748b80"]).map(function (tone) { return paint(tone, { roughness: 0.64 }); });
                    var tileWidth = style === "tile" ? 0.39 : 0.27;
                    var tileHeight = style === "tile" ? 0.225 : 0.27;
                    try {
                        for (var _s = __values([[front, width], [side, depth], [back, width], [west, depth]]), _t = _s.next(); !_t.done; _t = _s.next()) {
                            var _u = __read(_t.value, 2), face = _u[0], span = _u[1];
                            var rows = Math.ceil(height / tileHeight);
                            for (var row = 0; row < rows; row++) {
                                var offset = row % 2 ? tileWidth * 0.5 : 0;
                                var _loop_20 = function (col) {
                                    var tileLeft = -span / 2 + offset + col * tileWidth + 0.01;
                                    var tileRight = tileLeft + tileWidth - 0.02;
                                    var tileBottom = row * tileHeight + 8e-3;
                                    var tileTop = Math.min(height - 9e-3, (row + 1) * tileHeight - 8e-3);
                                    var faceOpenings = face === front ? openings.front : face === side ? openings.side : face === back ? backOpenings : westOpenings;
                                    if (faceOpenings.some(function (_d) {
                                        var _e = __read(_d, 4), ox = _e[0], oy = _e[1], ow = _e[2], oh = _e[3];
                                        return tileLeft < ox + ow / 2 && tileRight > ox - ow / 2 && tileBottom < oy + oh / 2 && tileTop > oy - oh / 2;
                                    }))
                                        return "continue";
                                    var left = Math.max(-span / 2 + 0.017, tileLeft);
                                    var right = Math.min(span / 2 - 0.017, tileRight);
                                    var bottom = tileBottom;
                                    var top = tileTop;
                                    if (right - left < 0.022 || top - bottom < 0.018)
                                        return "continue";
                                    var finish = tileFinishes[(row * 7 + col * 3 + 19) % tileFinishes.length];
                                    box2(face, finish, (left + right) / 2, (bottom + top) / 2, 0.012, right - left, top - bottom, 0.024, false);
                                };
                                for (var col = -1; col < Math.ceil(span / tileWidth) + 1; col++) {
                                    _loop_20(col);
                                }
                            }
                        }
                    }
                    catch (e_284_1) { e_284 = { error: e_284_1 }; }
                    finally {
                        try {
                            if (_t && !_t.done && (_f = _s.return)) _f.call(_s);
                        }
                        finally { if (e_284) throw e_284.error; }
                    }
                }
                box2(group, graphite, 0, floors[0] / 2, 0, width + 0.11, floors[0], depth + 0.11);
                box2(group, rim, 0, height + 0.058, 0, width + 0.1, 0.122, depth + 0.1);
                if (parapet) {
                    try {
                        for (var _v = __values([-1, 1]), _w = _v.next(); !_w.done; _w = _v.next()) {
                            var sx = _w.value;
                            box2(group, trim, sx * (width * 0.5 - 0.055), height + 0.2, 0, 0.13, 0.31, depth + 0.14);
                            box2(group, trim, 0, height + 0.2, sx * (depth * 0.5 - 0.055), width + 0.12, 0.31, 0.13);
                        }
                    }
                    catch (e_285_1) { e_285 = { error: e_285_1 }; }
                    finally {
                        try {
                            if (_w && !_w.done && (_g = _v.return)) _g.call(_v);
                        }
                        finally { if (e_285) throw e_285.error; }
                    }
                    var roofDrainX = width / 2 - 0.33;
                    box2(group, duct, -roofDrainX, height + 0.124, -depth / 2 + 0.17, 0.19, 0.021, 0.2);
                    box2(back, duct, roofDrainX, height + 0.08, 0.085, 0.14, 0.2, 0.17);
                    downspout(back, roofDrainX, height + 0.035, 0.13);
                }
                if (style !== "plaster") {
                    try {
                        for (var _x = __values([-1, 1]), _y = _x.next(); !_y.done; _y = _x.next()) {
                            var sx = _y.value;
                            var edgeWidth = style === "tile" ? 0.085 : 0.145;
                            box2(front, trim, sx * (width * 0.5 - 0.105), height * 0.5, 0.039, edgeWidth, height, 0.073);
                            box2(side, trim, sx * (depth * 0.5 - 0.105), height * 0.5, 0.038, edgeWidth, height, 0.072);
                        }
                    }
                    catch (e_286_1) { e_286 = { error: e_286_1 }; }
                    finally {
                        try {
                            if (_y && !_y.done && (_h = _x.return)) _h.call(_x);
                        }
                        finally { if (e_286) throw e_286.error; }
                    }
                }
                try {
                    for (var _z = __values(floors.entries()), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                        var _1 = __read(_0.value, 2), index = _1[0], floor = _1[1];
                        var y = floor + 1.19;
                        windowUnit(back, -width * 0.21, y, Math.min(1.18, width * 0.32), 1.24, index % 2 ? 1 : 0, rim);
                        if (index || !rearEntry)
                            windowUnit(back, width * 0.18, y, Math.min(1.12, width * 0.3), 1.22, index % 2 ? 2 : 4, rim);
                        windowUnit(west, -depth * 0.19, y, 1.21, 1.26, (index + 2) % roomCycle.length, rim);
                        windowUnit(west, depth * 0.22, y, 1.1, 1.2, (index + 1) % roomCycle.length, rim);
                    }
                }
                catch (e_287_1) { e_287 = { error: e_287_1 }; }
                finally {
                    try {
                        if (_0 && !_0.done && (_j = _z.return)) _j.call(_z);
                    }
                    finally { if (e_287) throw e_287.error; }
                }
                return { group: group, front: front, side: side, back: back, west: west };
            }
            {
                var floors = [0.24, 2.68, 5.04];
                var shopFrontOpenings = [[-0.87, 1.27, 1.91, 1.27], [1.1, 1.17, 1.04, 1.86], [-0.93, 3.86, 1.48, 1.27], [0.9, 3.58, 1.12, 1.8], [-0.93, 6.22, 1.48, 1.27], [0.9, 5.94, 1.12, 1.8]];
                var shopSideOpenings = [[-1.03, 1.27, 1.49, 1.27], [0.8, 1.27, 1.44, 1.27], [-1.02, 3.86, 1.13, 1.41], [0.56, 3.86, 1.47, 1.32], [-1.02, 6.22, 1.13, 1.41], [0.56, 6.22, 1.47, 1.32]];
                var _0 = makeBlock({ name: "\u6708\u706F\u66F8\u623F \xB7 Tsukiakari Books", x: -9.2, z: 10.53, width: 4.54, depth: 4.52, height: 7.64, floors: floors, color: "#bf9988", trim: trimWarm, rim: warmFrame, parapet: false, rearEntry: true, openings: { front: shopFrontOpenings, side: shopSideOpenings } }), group = _0.group, front = _0.front, side = _0.side, back = _0.back, west = _0.west;
                front.userData.sharedShop = side.userData.sharedShop = back.userData.sharedShop = true;
                furnishShop(group, 4.54, 4.52, floors[0], false);
                try {
                    for (var _1 = __values([2.62, 4.98, 7.4]), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                        var floor = _2.value;
                        box2(front, warmFrame, 0, floor, 0.05, 4.61, 0.074, 0.136);
                        box2(side, warmFrame, 0, floor, 0.048, 4.56, 0.074, 0.132);
                        box2(front, trimWarm, 0, floor + 0.048, 0.059, 4.63, 0.038, 0.15);
                        box2(side, trimWarm, 0, floor + 0.048, 0.058, 4.58, 0.038, 0.148);
                    }
                }
                catch (e_241_1) { e_241 = { error: e_241_1 }; }
                finally {
                    try {
                        if (_2 && !_2.done && (_d = _1.return)) _d.call(_1);
                    }
                    finally { if (e_241) throw e_241.error; }
                }
                var baseBrick = paint("#a67d68", { map: wallMap(4.53, 0.76, "brick") });
                var brickFaces = ["#9e7466", "#a77d6d", "#ad8270", "#967064"].map(function (tone) { return paint(tone, { roughness: 0.92 }); });
                var canopyRed = paint("#8f555a");
                var canopyUmber = paint("#c39679");
                try {
                    for (var _3 = __values([front, side]), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                        var face = _4.value;
                        box2(face, darkWood, 0, 2.27, 0.045, 4.04, 0.28, 0.095);
                        try {
                            for (var _5 = (e_243 = void 0, __values([-1.98, 0.28, 1.93])), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                                var x = _6.value;
                                box2(face, wood, x, 1.41, 0.17, 0.108, 2.2, 0.125);
                                box2(face, ochre, x + 0.028, 1.4, 0.236, 0.014, 2.15, 0.017, false);
                            }
                        }
                        catch (e_243_1) { e_243 = { error: e_243_1 }; }
                        finally {
                            try {
                                if (_6 && !_6.done && (_f = _5.return)) _f.call(_5);
                            }
                            finally { if (e_243) throw e_243.error; }
                        }
                        var lowerPanels = face === front ? [[-0.79, 2.55], [1.91, 0.35]] : [[0, 4]];
                        try {
                            for (var lowerPanels_1 = (e_244 = void 0, __values(lowerPanels)), lowerPanels_1_1 = lowerPanels_1.next(); !lowerPanels_1_1.done; lowerPanels_1_1 = lowerPanels_1.next()) {
                                var _7 = __read(lowerPanels_1_1.value, 2), x = _7[0], w = _7[1];
                                box2(face, baseBrick, x, 0.33, 0.063, w, 0.66, 0.12);
                                var brickW = 0.36, brickH = 0.135;
                                for (var row = 0; row < 5; row++) {
                                    var offset = row % 2 ? brickW * 0.5 : 0;
                                    for (var col = -1; col < Math.ceil(w / brickW) + 1; col++) {
                                        var px = x - w / 2 + offset + (col + 0.5) * brickW;
                                        if (Math.abs(px - x) > w / 2 - 0.012)
                                            continue;
                                        box2(face, brickFaces[(row * 3 + col * 5 + 20) % brickFaces.length], px, 0.035 + row * brickH, 0.14, brickW - 0.018, brickH - 0.012, 0.035, false);
                                    }
                                }
                                box2(face, wood, x, 0.552, 0.17, w, 0.063, 0.235);
                                box2(face, darkWood, x, 0.478, 0.153, w, 0.086, 0.194);
                            }
                        }
                        catch (e_244_1) { e_244 = { error: e_244_1 }; }
                        finally {
                            try {
                                if (lowerPanels_1_1 && !lowerPanels_1_1.done && (_g = lowerPanels_1.return)) _g.call(lowerPanels_1);
                            }
                            finally { if (e_244) throw e_244.error; }
                        }
                    }
                }
                catch (e_242_1) { e_242 = { error: e_242_1 }; }
                finally {
                    try {
                        if (_4 && !_4.done && (_e = _3.return)) _e.call(_3);
                    }
                    finally { if (e_242) throw e_242.error; }
                }
                windowUnit(front, -0.87, 1.27, 1.91, 1.27, "books", wood, 0.3);
                entrance(front, 1.1, floors[0], 1.04, 1.86, wood, "lamp");
                doorstep(front, 1.1, floors[0], 1.04, trimWarm);
                entrance(back, 0.77, floors[0], 0.86, 1.81, warmFrame, "dusk");
                doorstep(back, 0.77, floors[0], 0.86, trimWarm);
                windowUnit(side, -1.03, 1.27, 1.49, 1.27, "books", wood, 0.3);
                windowUnit(side, 0.8, 1.27, 1.44, 1.27, "books", wood, 0.3);
                try {
                    for (var _8 = __values([[front, -1.04, 2.12], [side, 0.2, 2.22]]), _9 = _8.next(); !_9.done; _9 = _8.next()) {
                        var _10 = __read(_9.value, 3), face = _10[0], x = _10[1], width = _10[2];
                        sign(face, x, 2.36, width, 0.38, { title: "\u6708\u706F\u66F8\u623F", subtitle: "TSUKIAKARI BOOKS", bg: "#553846", ink: "#ffe0a6", stripe: "#ba8871" }, 0.18, 1.08);
                        shopCanopy(face, x, 2.15, width + 0.1, 0.65, canopyRed, canopyUmber);
                    }
                }
                catch (e_245_1) { e_245 = { error: e_245_1 }; }
                finally {
                    try {
                        if (_9 && !_9.done && (_h = _8.return)) _h.call(_8);
                    }
                    finally { if (e_245) throw e_245.error; }
                }
                sign(front, -1.62, 0.79, 0.56, 0.24, { title: "\u65B0\u520A", subtitle: "NEW ARRIVALS", bg: "#51403e", ink: "#eed8ac", stripe: "#9e7b61" }, 0.13, 0.19);
                try {
                    for (var _11 = __values(floors.slice(1).entries()), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                        var _13 = __read(_12.value, 2), index = _13[0], floor = _13[1];
                        var y = floor + 1.18;
                        windowUnit(front, -0.93, y, 1.48, 1.27, index ? "curtains" : "lamp", warmFrame, 0.29);
                        entrance(front, 0.9, floor, 1.12, 1.8, warmFrame, index ? "dusk" : "plant", true);
                        balcony(front, 0.9, floor, 1.66);
                        planter(front, 0.21, floor, 0.39, 0.64, index === 0);
                        if (index === 0)
                            towel(front, linenRose, 1.19, floor + 0.8, 0.6, 0.39, 0.36, 0.8);
                        windowUnit(side, -1.02, y + 0.044, 1.13, 1.41, index ? "plant" : "dusk", warmFrame, 0.28);
                        windowUnit(side, 0.56, y, 1.47, 1.32, index ? "blinds" : "kitchen", warmFrame, null);
                        acUnit(side, 1.52, floor + 0.34);
                    }
                }
                catch (e_246_1) { e_246 = { error: e_246_1 }; }
                finally {
                    try {
                        if (_12 && !_12.done && (_j = _11.return)) _j.call(_11);
                    }
                    finally { if (e_246) throw e_246.error; }
                }
                condensateDrain(side, 2.01, floors[2] - 0.01);
                var bookSign = new THREE.Group();
                bookSign.name = "Bookshop vertical sign";
                bookSign.position.set(2.1, 5.04, 0);
                front.add(bookSign);
                var reach = 0.665;
                sign(bookSign, 0, 0, 0.37, 2.31, { title: "\u53E4\u672C", subtitle: "BOOKS", bg: "#883c61", ink: "#ffe4dc", stripe: "#df8e91", vertical: true }, reach, 1.32);
                try {
                    for (var _14 = __values([-1.02, 0.99]), _15 = _14.next(); !_15.done; _15 = _14.next()) {
                        var y = _15.value;
                        box2(bookSign, oldIron, 0, y, 0.045, 0.173, 0.123, 0.091);
                        box2(bookSign, oldIron, 0, y, 0.333, 0.078, 0.061, 0.548);
                        pipe(bookSign, oldIron, [0, y - 0.078, 0.088], [0, y - 0.016, 0.422], 0.019, false);
                    }
                }
                catch (e_247_1) { e_247 = { error: e_247_1 }; }
                finally {
                    try {
                        if (_15 && !_15.done && (_k = _14.return)) _k.call(_14);
                    }
                    finally { if (e_247) throw e_247.error; }
                }
                planter(front, -1.85, 0, 0.4, 1.2, true);
                planter(front, 2.01, 0, 0.35, 0.74, false, potGlaze);
                planter(side, 1.81, 0, 0.34, 1.02, true, potGlaze);
                wallLamp(front, 1.1, 2.27);
                wallLamp(side, 1.74, 2.28);
                roofSeams(group, 4.88, 4.86, 7.75, 0.211);
                try {
                    for (var _16 = __values([side, west]), _17 = _16.next(); !_17.done; _17 = _16.next()) {
                        var face = _17.value;
                        var end = face === side ? 1 : -1;
                        pipe(face, zinc, [-end * 2.4, 7.747, 0.214], [end * 2.1, 7.7, 0.214], 0.046);
                        pipe(face, zinc, [end * 2.1, 7.7, 0.214], [end * 2.4, 7.708, 0.214], 0.046);
                        downspout(face, end * 2.1, 7.7, 0.214);
                    }
                }
                catch (e_248_1) { e_248 = { error: e_248_1 }; }
                finally {
                    try {
                        if (_17 && !_17.done && (_l = _16.return)) _l.call(_16);
                    }
                    finally { if (e_248) throw e_248.error; }
                }
                box2(group, trimWarm, -0.95, 8.08, -1.36, 0.36, 0.57, 0.48);
                box2(group, zincSeam, -0.95, 8.4, -1.36, 0.46, 0.09, 0.58);
                antenna(group, 1.21, 8.02, -0.88, 0.92);
                var doorway = new THREE.PointLight("#ffbd92", 3.6, 2.9, 2);
                doorway.position.set(1.23, 1.93, 2.62);
                doorway.userData.airGlow = 0.8;
                group.add(doorway);
            }
            {
                var guard_1 = function (x1, y1, z1, x2, y2, z2) {
                    var e_288, _d, e_289, _e;
                    try {
                        for (var _f = __values([0.35, 0.81]), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var lift = _g.value;
                            pipe(front_1, stairSteel_1, [x1, y1 + lift, z1], [x2, y2 + lift, z2], lift > 0.5 ? 0.026 : 0.016);
                        }
                    }
                    catch (e_288_1) { e_288 = { error: e_288_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                        }
                        finally { if (e_288) throw e_288.error; }
                    }
                    try {
                        for (var _h = __values([0, 0.5, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var t = _j.value;
                            var x = THREE.MathUtils.lerp(x1, x2, t);
                            var y = THREE.MathUtils.lerp(y1, y2, t);
                            var z = THREE.MathUtils.lerp(z1, z2, t);
                            pipe(front_1, stairSteel_1, [x, y - 0.026, z], [x, y + 0.81, z], 0.023);
                        }
                    }
                    catch (e_289_1) { e_289 = { error: e_289_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                        }
                        finally { if (e_289) throw e_289.error; }
                    }
                }, flight = function (x1, y1, x2, y2, z) {
                    var e_290, _d;
                    var direction = Math.sign(x2 - x1);
                    var going = Math.abs(x2 - x1) / 5;
                    for (var i = 0; i < 5; i++) {
                        var x = x1 + direction * (i + 0.5) * going;
                        var floor = THREE.MathUtils.lerp(y1, y2, (i + 1) / 6);
                        box2(front_1, tread_1, x, floor - 0.025, z, going + 0.012, 0.05, laneWidth_1);
                        box2(front_1, duct, x - direction * (going * 0.36), floor + 2e-3, z, going * 0.16, 0.013, laneWidth_1 - 0.045, false);
                    }
                    try {
                        for (var _e = __values([z - laneWidth_1 / 2, z + laneWidth_1 / 2]), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var edge = _f.value;
                            pipe(front_1, stairSteel_1, [x1, y1 + 0.06, edge], [x2, y2 - 0.13, edge], 0.046);
                            guard_1(x1, y1 + 0.09, edge, x2, y2 - 0.09, edge);
                        }
                    }
                    catch (e_290_1) { e_290 = { error: e_290_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                        }
                        finally { if (e_290) throw e_290.error; }
                    }
                };
                var floors = [0.24, 2.4, 4.56, 6.72];
                var walkupSideOpenings_1 = [];
                floors.forEach(function (floor, index) {
                    var y = floor + 1.2;
                    walkupSideOpenings_1.push([-1.11, y, 1.44, 1.31]);
                    if (index === 2)
                        walkupSideOpenings_1.push([0.84, floor + 1.83 / 2, 1.25, 1.83]);
                    else
                        walkupSideOpenings_1.push([0.88, y, 1.37, 1.34]);
                });
                var landings = __spreadArray(__spreadArray([], __read(floors.map(function (floor) { return [-1.2, floor + 1.81 / 2, 0.79, 1.81]; })), false), [[0.58, 7.95, 1.24, 1.37]], false);
                var _18 = makeBlock({ name: "\u9752\u8449\u30CF\u30A4\u30C4 \xB7 Aoba Heights", x: -10.48, z: -11.66, width: 3.46, depth: 4.86, height: 9.5, floors: floors, color: "#8195af", trim: trimBlue, rim: blueFrame, style: "tile", openings: { front: landings, side: walkupSideOpenings_1 } }), group = _18.group, front_1 = _18.front, side = _18.side;
                var stairSteel_1 = paint("#697181", { metalness: 0.16 });
                var tread_1 = paint("#777787", { metalness: 0.16 });
                var band = paint("#7b8b9c");
                var landingWall = paint("#838695", { map: wallMap(1.51, 8.65, "plaster") });
                box2(front_1, landingWall, 0.29, 3.87, 0.044, 1.94, 6.78, 0.081);
                box2(front_1, band, -0.7, 4.72, 0.078, 0.052, 8.48, 0.108);
                box2(front_1, band, 1.28, 4.72, 0.078, 0.052, 8.48, 0.108);
                var doorX = -1.2;
                var start = -0.71;
                var turn = 0.82;
                var laneWidth_1 = 0.77;
                var lanes = [0.49, 1.31];
                var frontEdge = 1.72;
                try {
                    for (var _19 = __values([-1.68, 1.69]), _20 = _19.next(); !_20.done; _20 = _19.next()) {
                        var x = _20.value;
                        box2(front_1, graphite, x, 0.055, frontEdge - 0.055, 0.2, 0.11, 0.19);
                        box2(front_1, stairSteel_1, x, (floors.at(-1) + 0.11) / 2, frontEdge - 0.055, 0.095, floors.at(-1) - 0.11, 0.096);
                    }
                }
                catch (e_249_1) { e_249 = { error: e_249_1 }; }
                finally {
                    try {
                        if (_20 && !_20.done && (_m = _19.return)) _m.call(_19);
                    }
                    finally { if (e_249) throw e_249.error; }
                }
                try {
                    for (var _21 = __values(floors.entries()), _22 = _21.next(); !_22.done; _22 = _21.next()) {
                        var _23 = __read(_22.value, 2), index = _23[0], floor = _23[1];
                        entrance(front_1, doorX, floor, 0.79, 1.81, blueFrame, index === 2 ? "lamp" : "blinds");
                        box2(front_1, index ? stairSteel_1 : trimBlue, doorX, index ? floor - 0.056 : floor / 2, 0.865, 0.98, index ? 0.112 : floor, 1.73);
                        if (index)
                            box2(front_1, stairSteel_1, doorX, floor - 0.109, 0.035, 0.95, 0.17, 0.11);
                        box2(front_1, stairSteel_1, doorX, floor + 2.02, 0.23, 0.55, 0.071, 0.34);
                        box2(front_1, lampGlass, doorX, floor + 1.96, 0.225, 0.23, 0.072, 0.12, false);
                        lightPaint2.add(front_1, [doorX, floor + 6e-3, 0.92], [0.9, 1.43], "#e7bfa3", index === 2 ? 0.4 : 0.27, true);
                        guard_1(-1.69, floor, 0.09, -1.69, floor, frontEdge);
                        if (index)
                            guard_1(-1.69, floor, frontEdge, start, floor, frontEdge);
                        if (!index)
                            guard_1(start, floor, 0.9, start, floor, frontEdge);
                        if (index === floors.length - 1) {
                            guard_1(start, floor, 0.09, start, floor, 0.9);
                            continue;
                        }
                        var mid = (floor + floors[index + 1]) / 2;
                        box2(front_1, stairSteel_1, 1.27, mid - 0.06, 0.91, 0.9, 0.12, 1.62);
                        box2(front_1, band, 1.28, mid - 0.15, frontEdge - 0.053, 0.92, 0.11, 0.095);
                        box2(front_1, stairSteel_1, 1.33, mid - 0.13, 0.052, 0.71, 0.15, 0.14);
                        pipe(front_1, stairSteel_1, [1.69, mid - 0.15, frontEdge - 0.055], [1.69, mid - 0.15, 0.077], 0.043);
                        guard_1(1.71, mid, 0.1, 1.71, mid, frontEdge);
                        guard_1(turn, mid, frontEdge, 1.71, mid, frontEdge);
                        flight(start, floor, turn, mid, lanes[0]);
                        flight(turn, mid, start, floors[index + 1], lanes[1]);
                    }
                }
                catch (e_250_1) { e_250 = { error: e_250_1 }; }
                finally {
                    try {
                        if (_22 && !_22.done && (_o = _21.return)) _o.call(_21);
                    }
                    finally { if (e_250) throw e_250.error; }
                }
                doorstep(front_1, doorX, floors[0], 0.88, trimBlue, frontEdge - 0.018);
                try {
                    for (var _24 = __values(floors.entries()), _25 = _24.next(); !_25.done; _25 = _24.next()) {
                        var _26 = __read(_25.value, 2), index = _26[0], floor = _26[1];
                        var y = floor + 1.2;
                        box2(side, band, 0, floor - 0.06, 0.047, 4.75, 0.064, 0.104);
                        windowUnit(side, -1.11, y, 1.44, 1.31, ["dusk", "blinds", "plant", "kitchen"][index], blueFrame, 0.28);
                        if (index === 2) {
                            entrance(side, 0.84, floor, 1.25, 1.83, blueFrame, "dusk", true);
                            balcony(side, 0.85, floor, 1.68, 0.55);
                            towel(side, linenCream, 0.57, floor + 0.8, 0.55, 0.57, 0.38, 1.5);
                            planter(side, 1.52, floor, 0.34, 0.6, false, potGlaze);
                        }
                        else
                            windowUnit(side, 0.88, y, 1.37, 1.34, ["blinds", "lamp", "dusk", "curtains"][index], blueFrame, 0.27);
                        if (index % 2)
                            acUnit(side, 1.79, floor + 0.38);
                    }
                }
                catch (e_251_1) { e_251 = { error: e_251_1 }; }
                finally {
                    try {
                        if (_25 && !_25.done && (_p = _24.return)) _p.call(_24);
                    }
                    finally { if (e_251) throw e_251.error; }
                }
                condensateDrain(side, 2.28, floors[3] + 0.03);
                windowUnit(front_1, 0.58, 7.95, 1.24, 1.37, "blinds", blueFrame, 0.31);
                sign(side, -2.04, 6.04, 0.44, 2.86, { title: "\u9752\u8449\u8358", subtitle: "AOBA", bg: "#31577c", ink: "#c5e9ef", stripe: "#659ac5", vertical: true }, 0.27, 1.25);
                try {
                    for (var _27 = __values([-1.65, 1.65]), _28 = _27.next(); !_28.done; _28 = _27.next()) {
                        var x = _28.value;
                        box2(group, zincSeam, x, 9.88, 0, 0.13, 0.038, 4.97);
                    }
                }
                catch (e_252_1) { e_252 = { error: e_252_1 }; }
                finally {
                    try {
                        if (_28 && !_28.done && (_q = _27.return)) _q.call(_27);
                    }
                    finally { if (e_252) throw e_252.error; }
                }
                try {
                    for (var _29 = __values([-2.37, 2.37]), _30 = _29.next(); !_30.done; _30 = _29.next()) {
                        var z = _30.value;
                        box2(group, zincSeam, 0, 9.88, z, 3.57, 0.038, 0.13);
                    }
                }
                catch (e_253_1) { e_253 = { error: e_253_1 }; }
                finally {
                    try {
                        if (_30 && !_30.done && (_r = _29.return)) _r.call(_29);
                    }
                    finally { if (e_253) throw e_253.error; }
                }
                tank(group, 0.72, 9.619, -0.92, 0.94);
                antenna(group, -0.91, 9.619, 0.97, 0.78);
                roofHatch(group, -0.68, 9.619, -1.15, zinc);
            }
            {
                var floors = [0.21, 2.51, 4.8];
                var pharmacyFrontOpenings = [[-0.66, 1.23, 1.54, 1.36], [0.86, 1.155, 0.86, 1.89], [-0.84, 3.385, 1.2, 1.75], [0.8, 3.62, 1.17, 1.28], [-0.84, 5.675, 1.2, 1.75], [0.8, 5.91, 1.17, 1.28]];
                var pharmacySideOpenings = [[0.81, 1.28, 1.8, 1.44], [-0.84, 1.14, 0.93, 1.86], [-0.99, 3.395, 1.19, 1.77], [0.65, 3.62, 1.27, 1.34], [-0.99, 5.685, 1.19, 1.77], [0.65, 5.91, 1.27, 1.34]];
                var _31 = makeBlock({ name: "\u6F6E\u898B\u85AC\u5C40 \xB7 Shiomi Pharmacy", x: 9.63, z: -11.7, width: 3.69, depth: 4.43, height: 7.24, floors: floors, color: "#809d91", trim: trimGreen, rim: glazedCaps, style: "glazed", openings: { front: pharmacyFrontOpenings, side: pharmacySideOpenings } }), group = _31.group, front = _31.front, side = _31.side;
                front.userData.sharedShop = side.userData.sharedShop = true;
                furnishShop(group, 3.69, 4.43, floors[0], true);
                var awning = paint("#567775");
                var mint = paint("#789486");
                var mintLight = paint("#bbc3aa");
                var plum = paint("#8c5d62");
                try {
                    for (var _32 = __values([2.45, 4.74, 6.98]), _33 = _32.next(); !_33.done; _33 = _32.next()) {
                        var floor = _33.value;
                        box2(front, glazedCaps, 0, floor, 0.044, 3.7, 0.09, 0.124);
                        box2(side, glazedCaps, 0, floor, 0.043, 4.4, 0.09, 0.128);
                    }
                }
                catch (e_254_1) { e_254 = { error: e_254_1 }; }
                finally {
                    try {
                        if (_33 && !_33.done && (_s = _32.return)) _s.call(_32);
                    }
                    finally { if (e_254) throw e_254.error; }
                }
                try {
                    for (var _34 = __values([[front, 3.62, [[-0.72, 2], [1.62, 0.36]]], [side, 4.32, [[-1.77, 0.69], [0.91, 2.44]]]]), _35 = _34.next(); !_35.done; _35 = _34.next()) {
                        var _36 = __read(_35.value, 3), face = _36[0], width = _36[1], lowPanels = _36[2];
                        box2(face, awning, 0, 2.22, 0.054, width, 0.19, 0.1);
                        try {
                            for (var lowPanels_1 = (e_256 = void 0, __values(lowPanels)), lowPanels_1_1 = lowPanels_1.next(); !lowPanels_1_1.done; lowPanels_1_1 = lowPanels_1.next()) {
                                var _37 = __read(lowPanels_1_1.value, 2), x = _37[0], w = _37[1];
                                box2(face, mint, x, 0.3, 0.145, w, 0.52, 0.13);
                                for (var dx = -w / 2 + 0.1; dx < w / 2 - 0.04; dx += 0.2)
                                    box2(face, glazedCaps, x + dx, 0.3, 0.214, 0.025, 0.49, 0.017, false);
                            }
                        }
                        catch (e_256_1) { e_256 = { error: e_256_1 }; }
                        finally {
                            try {
                                if (lowPanels_1_1 && !lowPanels_1_1.done && (_u = lowPanels_1.return)) _u.call(lowPanels_1);
                            }
                            finally { if (e_256) throw e_256.error; }
                        }
                    }
                }
                catch (e_255_1) { e_255 = { error: e_255_1 }; }
                finally {
                    try {
                        if (_35 && !_35.done && (_t = _34.return)) _t.call(_34);
                    }
                    finally { if (e_255) throw e_255.error; }
                }
                entrance(front, 0.86, floors[0], 0.86, 1.89, mint, "pharmacy");
                doorstep(front, 0.86, floors[0], 0.86, trimGreen);
                windowUnit(front, -0.66, 1.23, 1.54, 1.36, "pharmacy", mint, 0.29);
                windowUnit(side, 0.81, 1.28, 1.8, 1.44, "pharmacy", mint, 0.29);
                entrance(side, -0.84, floors[0], 0.93, 1.86, mint, "dusk");
                doorstep(side, -0.84, floors[0], 0.93, trimGreen);
                shopCanopy(front, -0.73, 2.02, 2, 0.58, awning, mintLight);
                shopCanopy(side, 0.66, 2.12, 2.36, 0.44, awning, mintLight);
                sign(front, -1.21, 0.92, 0.55, 0.29, { title: "\u51E6\u65B9\u305B\u3093", subtitle: "PRESCRIPTIONS", bg: "#416866", ink: "#ecedcf", stripe: "#88a992" }, 0.1, 0.23);
                try {
                    for (var _38 = __values(floors.slice(1).entries()), _39 = _38.next(); !_39.done; _39 = _38.next()) {
                        var _40 = __read(_39.value, 2), index = _40[0], floor = _40[1];
                        var y = floor + 1.11;
                        entrance(front, -0.84, floor, 1.2, 1.75, glazedCaps, index ? "plant" : "dusk", true);
                        windowUnit(front, 0.8, y, 1.17, 1.28, index ? "blinds" : "kitchen", glazedCaps, 0.28);
                        balcony(front, -0.85, floor, 1.64, 0.57);
                        planter(front, -1.48, floor, 0.41, 0.74, index !== 0, potGlaze);
                        entrance(side, -0.99, floor, 1.19, 1.77, glazedCaps, index ? "curtains" : "lamp", true);
                        windowUnit(side, 0.65, y, 1.27, 1.34, index ? "dusk" : "blinds", glazedCaps, 0.28);
                        balcony(side, -0.98, floor, 1.65, 0.54);
                        planter(side, -1.63, floor, 0.36, 0.68, true);
                        if (index === 0)
                            towel(side, linenCream, -0.77, floor + 0.8, 0.54, 0.41, 0.31, 0.2);
                        acUnit(side, 1.56, floor + 0.37);
                    }
                }
                catch (e_257_1) { e_257 = { error: e_257_1 }; }
                finally {
                    try {
                        if (_39 && !_39.done && (_v = _38.return)) _v.call(_38);
                    }
                    finally { if (e_257) throw e_257.error; }
                }
                condensateDrain(side, 2.05, floors[2] + 0.02);
                sign(front, -0.73, 2.23, 1.83, 0.26, { title: "\u6F6E\u898B\u85AC\u5C40", subtitle: "SHIOMI PHARMACY", bg: "#d2d0a8", ink: "#33575a", stripe: "#718a72" }, 0.17, 0.83);
                sign(side, 0.94, 2.38, 1.86, 0.35, { title: "\u6F6E\u898B\u85AC\u5C40", subtitle: "SHIOMI PHARMACY", bg: "#ded3b5", ink: "#385761", stripe: "#9e7c80" }, 0.21, 0.81);
                sign(front, 1.49, 4.48, 0.39, 2.22, { title: "\u304F\u3059\u308A", subtitle: "PHARMACY", bg: "#654658", ink: "#ffdbc9", stripe: "#bb859b", vertical: true }, 0.21, 1.05);
                box2(side, plum, -1.56, 2.18, 0.3, 0.49, 0.49, 0.16);
                box2(side, gold, -1.56, 2.18, 0.392, 0.285, 0.071, 0.025, false);
                box2(side, gold, -1.56, 2.18, 0.392, 0.073, 0.285, 0.025, false);
                box2(front, plum, 1.65, 0.46, 0.31, 0.24, 0.64, 0.34);
                box2(front, gold, 1.65, 0.8, 0.31, 0.13, 0.046, 0.2, false);
                planter(front, -1.57, 0, 0.37, 1.07, false);
                try {
                    for (var _41 = __values([-1.79, 1.79]), _42 = _41.next(); !_42.done; _42 = _41.next()) {
                        var x = _42.value;
                        box2(group, glazedCaps, x, 7.62, 0, 0.16, 0.055, 4.59);
                    }
                }
                catch (e_258_1) { e_258 = { error: e_258_1 }; }
                finally {
                    try {
                        if (_42 && !_42.done && (_w = _41.return)) _w.call(_41);
                    }
                    finally { if (e_258) throw e_258.error; }
                }
                try {
                    for (var _43 = __values([-2.16, 2.16]), _44 = _43.next(); !_44.done; _44 = _43.next()) {
                        var z = _44.value;
                        box2(group, glazedCaps, 0, 7.62, z, 3.81, 0.055, 0.16);
                    }
                }
                catch (e_259_1) { e_259 = { error: e_259_1 }; }
                finally {
                    try {
                        if (_44 && !_44.done && (_x = _43.return)) _x.call(_43);
                    }
                    finally { if (e_259) throw e_259.error; }
                }
                tank(group, 0.84, 7.359, -1.03, 0.84);
                antenna(group, -1.07, 7.359, 0.84, 0.77);
                roofHatch(group, -0.62, 7.359, -0.87, glazedCaps);
                box2(group, awning, 0.74, 7.49, 1.39, 1.43, 0.262, 0.54);
                try {
                    for (var _45 = __values([0.18, 0.53, 0.89, 1.24]), _46 = _45.next(); !_46.done; _46 = _45.next()) {
                        var x = _46.value;
                        planter(group, x, 7.621, 1.39, 0.65, false, potGlaze);
                    }
                }
                catch (e_260_1) { e_260 = { error: e_260_1 }; }
                finally {
                    try {
                        if (_46 && !_46.done && (_y = _45.return)) _y.call(_45);
                    }
                    finally { if (e_260) throw e_260.error; }
                }
            }
            var _loop_18 = function (group, geometry, finish, cast, matrices) {
                var mesh = new THREE.InstancedMesh(geometry, finish, matrices.length);
                mesh.castShadow = cast && !group.userData.windowAndDoorTrim;
                mesh.receiveShadow = !group.userData.windowAndDoorTrim;
                matrices.forEach(function (matrix2, index) { return mesh.setMatrixAt(index, matrix2); });
                group.add(mesh);
            };
            try {
                for (var _47 = __values(batches.values()), _48 = _47.next(); !_48.done; _48 = _47.next()) {
                    var _49 = _48.value, group = _49.group, geometry = _49.geometry, finish = _49.finish, cast = _49.cast, matrices = _49.matrices;
                    _loop_18(group, geometry, finish, cast, matrices);
                }
            }
            catch (e_261_1) { e_261 = { error: e_261_1 }; }
            finally {
                try {
                    if (_48 && !_48.done && (_z = _47.return)) _z.call(_47);
                }
                finally { if (e_261) throw e_261.error; }
            }
        }
        function buildKiosk(parent, lightPaint2) {
            var e_291, _d, e_292, _e, e_293, _f, e_294, _g, e_295, _h, e_296, _j, e_297, _k, e_298, _l, e_299, _m;
            var kiosk2 = new THREE.Group();
            kiosk2.name = "\u5915\u51EA\u65B0\u805E\u5E97";
            kiosk2.position.set(10.65, 0.18, 5.09);
            parent.add(kiosk2);
            var timber = material("#535058");
            var clay = material("#8d6963");
            var dark = material("#343044");
            var slate = material("#3e465b", { roughness: 0.85 });
            var mutedSlate = material("#535267");
            var brass = material("#bd9977");
            var paper = material("#cbc0aa");
            var lamp = material("#ffddb0", { emissive: "#ffa85d", emissiveIntensity: 1.48 });
            var red = material("#a34f57");
            var xFace = new THREE.Group();
            var zFace = new THREE.Group();
            xFace.position.x = 1.09;
            xFace.rotation.y = Math.PI / 2;
            zFace.position.z = 1.18;
            kiosk2.add(xFace, zFace);
            block(kiosk2, dark, 0, 0.065, 0, 2.48, 0.13, 2.65);
            block(kiosk2, clay, -1.045, 0.415, 0, 0.11, 0.57, 2.36);
            block(kiosk2, clay, 1.045, 0.415, 0, 0.11, 0.57, 2.36);
            block(kiosk2, clay, 0, 0.415, 1.125, 2.2, 0.57, 0.11);
            block(kiosk2, clay, -1.045, 1.974, 0, 0.11, 0.372, 2.36);
            block(kiosk2, clay, 1.045, 1.974, 0, 0.11, 0.372, 2.36);
            block(kiosk2, clay, 0, 1.974, 1.125, 2.2, 0.372, 0.11);
            block(kiosk2, clay, -1.045, 1.236, 0, 0.11, 1.104, 2.36);
            block(kiosk2, clay, -0.8275, 1.135, -1.125, 0.545, 2.01, 0.15);
            block(kiosk2, clay, 0.8275, 1.135, -1.125, 0.545, 2.01, 0.15);
            block(kiosk2, clay, 0, 2.13, -1.125, 1.11, 0.1, 0.15);
            block(kiosk2, timber, 0, 0.718, 0, 2.02, 0.045, 2.16);
            block(kiosk2, timber, -0.51, 0.98, -0.37, 0.45, 0.52, 1.34);
            block(kiosk2, brass, -0.51, 1.255, -0.37, 0.56, 0.06, 1.42);
            block(kiosk2, dark, -0.49, 1.35, 0.06, 0.23, 0.14, 0.24);
            block(kiosk2, paper, -0.45, 1.286, -0.52, 0.28, 0.018, 0.38, false);
            for (var i = 0; i < 3; i++) {
                var z = -0.71 + i * 0.21;
                for (var sheet = 0; sheet < 3; sheet++) {
                    var stack = block(kiosk2, paper, -0.59, 1.304 + sheet * 0.013, z, 0.24, 0.011, 0.14, false);
                    stack.rotation.y = (i - 1) * 0.12 + sheet * 0.05;
                }
                block(kiosk2, red, -0.605, 1.341, z - 0.031, 0.167, 9e-3, 0.022, false);
            }
            block(kiosk2, mutedSlate, 0.06, 1.017, -0.69, 0.42, 0.049, 0.41);
            try {
                for (var _o = __values([-0.08, 0.2]), _p = _o.next(); !_p.done; _p = _o.next()) {
                    var x = _p.value;
                    try {
                        for (var _q = (e_292 = void 0, __values([-0.82, -0.56])), _r = _q.next(); !_r.done; _r = _q.next()) {
                            var z = _r.value;
                            block(kiosk2, dark, x, 0.874, z, 0.036, 0.26, 0.036, false);
                        }
                    }
                    catch (e_292_1) { e_292 = { error: e_292_1 }; }
                    finally {
                        try {
                            if (_r && !_r.done && (_e = _q.return)) _e.call(_q);
                        }
                        finally { if (e_292) throw e_292.error; }
                    }
                }
            }
            catch (e_291_1) { e_291 = { error: e_291_1 }; }
            finally {
                try {
                    if (_p && !_p.done && (_d = _o.return)) _d.call(_o);
                }
                finally { if (e_291) throw e_291.error; }
            }
            block(kiosk2, timber, 0.06, 1.15, -0.876, 0.38, 0.21, 0.048);
            block(kiosk2, mutedSlate, 0.61, 0.902, -0.88, 0.48, 0.3, 0.31, false);
            for (var i = 0; i < 5; i++)
                block(kiosk2, paper, 0.46 + i * 0.065, 1.08, -0.88, 0.054, 0.05, 0.166, false);
            block(kiosk2, timber, 0, 1.726, -1.053, 1.65, 0.055, 0.23);
            for (var i = 0; i < 9; i++) {
                block(kiosk2, i % 3 === 0 ? red : paper, (i - 4) * 0.16, 1.6, -1.03, 0.11, 0.2, 0.12, false);
            }
            block(kiosk2, lamp, -0.28, 1.754, 0.25, 0.31, 0.039, 0.13, false);
            var counterLight = new THREE.PointLight("#ffd7a9", 1.8, 2.6, 2);
            counterLight.position.set(-0.28, 1.69, 0.25);
            kiosk2.add(counterLight);
            lightPaint2.add(kiosk2, [-0.48, 1.292, -0.22], [0.5, 1.13], "#ffd99f", 0.56, true);
            block(kiosk2, timber, 1.056, 1.236, 1.136, 0.09, 1.104, 0.09);
            try {
                for (var _s = __values([[xFace, 2.36], [zFace, 2.2]]), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var _u = __read(_t.value, 2), face = _u[0], width = _u[1];
                    try {
                        for (var _v = (e_294 = void 0, __values([-width / 2 + 0.06, width / 2 - 0.06])), _w = _v.next(); !_w.done; _w = _v.next()) {
                            var px = _w.value;
                            block(face, timber, px, 1.1, 0.066, 0.11, 2.15, 0.14);
                        }
                    }
                    catch (e_294_1) { e_294 = { error: e_294_1 }; }
                    finally {
                        try {
                            if (_w && !_w.done && (_g = _v.return)) _g.call(_v);
                        }
                        finally { if (e_294) throw e_294.error; }
                    }
                    try {
                        for (var _x = (e_295 = void 0, __values([0.28, 0.49, 0.7, 1.91, 2.14])), _y = _x.next(); !_y.done; _y = _x.next()) {
                            var y = _y.value;
                            block(face, timber, 0, y, 0.071, width, 0.049, 0.051);
                        }
                    }
                    catch (e_295_1) { e_295 = { error: e_295_1 }; }
                    finally {
                        try {
                            if (_y && !_y.done && (_h = _x.return)) _h.call(_x);
                        }
                        finally { if (e_295) throw e_295.error; }
                    }
                    block(face, timber, 0, 2.07, 0.072, width, 0.23, 0.13);
                }
            }
            catch (e_293_1) { e_293 = { error: e_293_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_f = _s.return)) _f.call(_s);
                }
                finally { if (e_293) throw e_293.error; }
            }
            var roofAngle = 0.15;
            var roofHeight = 2.36;
            var soffit = new THREE.BufferGeometry();
            var wallCorners = [];
            try {
                for (var _z = __values([false, true]), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                    var top = _0.value;
                    try {
                        for (var _1 = (e_297 = void 0, __values([[-1.1, -1.18], [1.1, -1.18], [1.1, 1.18], [-1.1, 1.18]])), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                            var _3 = __read(_2.value, 2), x = _3[0], z = _3[1];
                            wallCorners.push(x, top ? 2.35 - Math.sin(roofAngle) * z : 2.12, z);
                        }
                    }
                    catch (e_297_1) { e_297 = { error: e_297_1 }; }
                    finally {
                        try {
                            if (_2 && !_2.done && (_k = _1.return)) _k.call(_1);
                        }
                        finally { if (e_297) throw e_297.error; }
                    }
                }
            }
            catch (e_296_1) { e_296 = { error: e_296_1 }; }
            finally {
                try {
                    if (_0 && !_0.done && (_j = _z.return)) _j.call(_z);
                }
                finally { if (e_296) throw e_296.error; }
            }
            soffit.setAttribute("position", new THREE.Float32BufferAttribute(wallCorners, 3));
            soffit.setIndex([0, 5, 1, 0, 4, 5, 1, 6, 2, 1, 5, 6, 2, 7, 3, 2, 6, 7, 3, 4, 0, 3, 7, 4]);
            soffit.computeVertexNormals();
            place(kiosk2, soffit, clay, 0, 0, 0);
            block(kiosk2, slate, 0, roofHeight, 0, 2.73, 0.115, 2.85).rotation.x = roofAngle;
            for (var i = 0; i < 12; i++) {
                block(kiosk2, mutedSlate, -1.24 + i * 0.225, roofHeight + 0.069, 0, 0.032, 0.039, 2.83).rotation.x = roofAngle;
            }
            try {
                for (var _4 = __values([-1.39, 1.39]), _5 = _4.next(); !_5.done; _5 = _4.next()) {
                    var z = _5.value;
                    block(kiosk2, timber, 0, roofHeight - Math.sin(roofAngle) * z, z, 2.76, 0.105, 0.094);
                }
            }
            catch (e_298_1) { e_298 = { error: e_298_1 }; }
            finally {
                try {
                    if (_5 && !_5.done && (_l = _4.return)) _l.call(_4);
                }
                finally { if (e_298) throw e_298.error; }
            }
            rod(kiosk2, mutedSlate, [-1.38, 2.154, 1.44], [1.39, 2.154, 1.44], 0.031);
            rod(kiosk2, mutedSlate, [1.31, 2.15, 1.43], [1.18, 2.08, 1.26], 0.031);
            rod(kiosk2, mutedSlate, [1.18, 2.08, 1.26], [1.18, 0.22, 1.26], 0.031);
            block(kiosk2, timber, 0, 0.15, -1.3, 1.12, 0.05, 0.55);
            block(kiosk2, dark, 0, 0.08, -1.58, 1.28, 0.16, 0.34);
            var print = paintedTexture(512, 160, function (ctx, w, h) {
                ctx.fillStyle = "#edd3a6";
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = "#8f4e59";
                ctx.lineWidth = 5;
                ctx.strokeRect(9, 9, w - 18, h - 18);
                ctx.fillStyle = "#5a394b";
                ctx.textAlign = "center";
                ctx.font = '700 57px "Yu Mincho", serif';
                ctx.fillText("\u5915\u51EA\u65B0\u805E\u5E97", w / 2, 88);
                ctx.font = "600 17px sans-serif";
                ctx.fillText("Y\u016ANAGI NEWS", w / 2, 123);
            });
            var sign = material("#fffaf2", { map: print, emissive: "#ffd9b2", emissiveMap: print, emissiveIntensity: 1.02 });
            var newsprint = ["#dfcbb2", "#b3b5bd", "#d5b6a7"].map(function (color) { return material(color, { emissive: "#94704f", emissiveIntensity: 0.29 }); });
            var glass = new THREE.MeshBasicMaterial({ color: "#ebddd2", transparent: true, opacity: 0.065, depthWrite: false });
            try {
                for (var _6 = __values([[xFace, 1.87], [zFace, 1.92]]), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                    var _8 = __read(_7.value, 2), face = _8[0], width = _8[1];
                    boxWindow(face, width);
                    var plaque = place(face, new THREE.PlaneGeometry(width, 0.34), sign, 0, 2.08, 0.151, false);
                    plaque.receiveShadow = true;
                }
            }
            catch (e_299_1) { e_299 = { error: e_299_1 }; }
            finally {
                try {
                    if (_7 && !_7.done && (_m = _6.return)) _m.call(_6);
                }
                finally { if (e_299) throw e_299.error; }
            }
            function boxWindow(face, width) {
                var e_300, _d, e_301, _e;
                try {
                    for (var _f = __values([-width / 2, width / 2]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var x = _g.value;
                        block(face, timber, x, 1.27, -0.08, 0.06, 1.025, 0.42);
                    }
                }
                catch (e_300_1) { e_300 = { error: e_300_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_300) throw e_300.error; }
                }
                try {
                    for (var _h = __values(face === xFace ? [0.79, 1.24] : [0.79]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var y = _j.value;
                        block(face, brass, 0, y, -0.11, width, 0.044, 0.36, false);
                        lightPaint2.add(face, [0.12, y + 0.027, -0.095], [width * 0.87, 0.33], "#ffe0b0", 0.47, true);
                        for (var i = 0; i < 6; i++) {
                            var x = (i - 2.5) * width / 6.4;
                            var h = 0.27 + i % 3 * 0.026;
                            var issue = block(face, newsprint[i % 3], x, y + 0.024 + h / 2, -0.12, width / 7.6, h, 0.055, false);
                            issue.rotation.x = -0.13;
                            block(face, red, x, y + h - 0.04, -0.082, width / 10, 0.022, 0.01, false);
                            for (var line = 0; line < 3; line++)
                                block(face, mutedSlate, x, y + h - 0.105 - line * 0.023, -0.076, width / 13, 8e-3, 0.01, false);
                        }
                    }
                }
                catch (e_301_1) { e_301 = { error: e_301_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_301) throw e_301.error; }
                }
                place(face, new THREE.PlaneGeometry(width, 1.025), glass, 0, 1.27, 0.144, false);
                block(face, timber, 0, 1.29, 0.19, 0.052, 1.079, 0.057);
                block(face, timber, 0, 0.75, 0.24, width + 0.13, 0.106, 0.34);
                block(face, timber, 0, 1.84, 0.18, width + 0.13, 0.091, 0.11);
            }
            for (var i = 0; i < 4; i++) {
                var x = -0.68 + i * 0.4;
                block(zFace, timber, x, 0.38, 0.278, 0.36, 0.44, 0.29);
                block(zFace, paper, x, 0.58, 0.295, 0.31, 0.22, 0.058).rotation.x = -0.23;
                block(zFace, red, x, 0.64, 0.306, 0.21, 0.023, 0.028, false);
                for (var row = 0; row < 3; row++)
                    block(zFace, brass, x, 0.61 - row * 0.026, 0.308, 0.252, 9e-3, 0.021, false);
            }
            block(kiosk2, red, 1.23, 0.51, -0.68, 0.39, 0.63, 0.35);
            block(kiosk2, red, 1.23, 0.858, -0.68, 0.43, 0.11, 0.4);
            block(kiosk2, dark, 1.431, 0.701, -0.68, 0.021, 0.054, 0.21);
            block(kiosk2, paper, 1.434, 0.582, -0.68, 0.022, 0.1, 0.142);
            rod(xFace, brass, [0.72, 2.3, 0.15], [0.72, 2.29, 0.35], 0.018);
            block(xFace, brass, 0.72, 2.25, 0.37, 0.142, 0.076, 0.14);
            block(xFace, lamp, 0.72, 2.21, 0.37, 0.085, 0.024, 0.082, false);
            var spill = new THREE.PointLight("#ffd2a2", 2.4, 2.9, 2);
            spill.position.set(1.39, 1.63, 0.55);
            spill.userData.airGlow = 0.8;
            kiosk2.add(spill);
            lightPaint2.add(xFace, [0.59, 4e-3, 0.84], [1.11, 1.26], "#ffc58f", 0.39, true);
        }
        var RAIL_APPROACH_LENGTH = 9.2;
        function addRailMistPass(group, name) {
            var e_302, _d;
            var mistPass = new THREE.Group();
            mistPass.name = name;
            var materials = new Map();
            try {
                for (var _e = __values(group.children), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var mesh = _f.value;
                    if (!mesh.isMesh)
                        continue;
                    var original = mesh.material;
                    if (!materials.has(original)) {
                        var mist = original.clone();
                        mist.transparent = true;
                        mist.depthWrite = false;
                        mist.userData.railMistPass = "exterior";
                        original.userData.railMistPass = "solid";
                        materials.set(original, mist);
                    }
                    var outer = mesh.clone(false);
                    outer.material = materials.get(original);
                    outer.castShadow = false;
                    if (mesh.isInstancedMesh && mesh.userData.tramMotion)
                        outer.instanceMatrix = mesh.instanceMatrix;
                    mistPass.add(outer);
                }
            }
            catch (e_302_1) { e_302 = { error: e_302_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_302) throw e_302.error; }
            }
            group.add(mistPass);
            return mistPass;
        }
        function buildTramHeadlightBeams(train2, lampX, routeEnd) {
            var length = 5.1;
            var boundsMin = new THREE.Vector3(0, -0.75, -1.12);
            var boundsMax = new THREE.Vector3(length, 0.33, 1.12);
            var size = boundsMax.clone().sub(boundsMin);
            var geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            var center = boundsMin.clone().lerp(boundsMax, 0.5);
            geometry.translate(center.x, center.y, center.z);
            var weather = { value: 0 };
            var beam = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: { weather: weather, boundsMin: { value: boundsMin }, boundsMax: { value: boundsMax }, routeEnd: { value: routeEnd } },
                vertexShader: "\n          varying vec3 rayStart;\n          varying vec3 worldPoint;\n          void main() {\n            rayStart = position;\n            worldPoint = (modelMatrix * vec4(position,1.0)).xyz;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n          }",
                fragmentShader: "\n          uniform float weather;\n          uniform vec3 boundsMin;\n          uniform vec3 boundsMax;\n          uniform float routeEnd;\n          varying vec3 rayStart;\n          varying vec3 worldPoint;\n\n          vec2 scatter(vec3 p) {\n            float beamWidth = 0.074 + p.x * 0.108;\n            float lampOffset = abs(p.z)-0.444;\n            vec2 section = vec2((p.y+0.096*p.x)*1.36,lampOffset)/beamWidth;\n            float radial = dot(section,section);\n            float taper = 1.0 - smoothstep(0.50,5.05,p.x);\n            float cone = exp(-3.15*radial)*(1.0-smoothstep(0.60,1.34,radial))*taper;\n            float glow = exp(-13.0*p.x*p.x - 29.0*(p.y*p.y+lampOffset*lampOffset));\n            float outer = exp(-1.64*radial)*taper*(0.84+0.16*sin((p.x+p.y)*3.1+2.2));\n            float floorFade = smoothstep(-0.73,-0.47,p.y);\n            return vec2(cone*.75+glow*.68,outer*.24)*floorFade;\n          }\n\n          void main() {\n            // The orthographic view direction is the same for every ray.\n            vec3 ray = -vec3(viewMatrix[0].z,viewMatrix[1].z,viewMatrix[2].z);\n            vec3 exitPlane = mix(boundsMin,boundsMax,step(vec3(0.0),ray));\n            vec3 exits = mix(vec3(1.0e4),(exitPlane-rayStart)/(abs(ray)+0.00001)*sign(ray),\n              step(vec3(0.0001),abs(ray)));\n            float path = max(0.0,min(exits.x,min(exits.y,exits.z)));\n            float stride = path / 10.0;\n            vec2 light = vec2(0.0);\n            for (int i=0; i<10; i++) light += scatter(rayStart+ray*((float(i)+0.5)*stride));\n            float perimeter = 1.0-smoothstep(routeEnd-6.0,routeEnd-0.2,abs(worldPoint.x));\n            float energy = light.x+light.y;\n            float gold = light.x/max(0.0001,energy);\n            float alpha = (1.0-exp(-energy*stride*1.99))*perimeter*weather;\n            vec3 color = mix(vec3(.62,.64,.62),vec3(1.0,.73,.43),gold);\n            gl_FragColor = vec4(color,alpha);\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n          }"
            }));
            beam.name = "Rain scattering from the tram headlights";
            beam.position.set(lampX, 6.095, 0);
            beam.visible = false;
            train2.add(beam);
            return function (amount) {
                weather.value = amount;
                beam.visible = amount > 2e-3;
            };
        }
        function buildHeroTram(train2, edgePlanes, makeTexture, tramMaterial) {
            var e_303, _d, e_304, _e, e_305, _f, e_306, _g, e_307, _h, e_308, _j, e_309, _k, e_310, _l;
            var unitY = new THREE.Vector3(0, 1, 0);
            var spacing = 6.1;
            var bodyEnd = 2.979;
            var sideZ = 0.82;
            var cornerX = 0.329;
            var cornerZ = 0.257;
            var roofSpring = 7.267;
            var lampY = 6.095;
            var lampOffset = 0.444;
            var smooth = THREE.MathUtils.smoothstep;
            var vec = function (x, y, z) { return new THREE.Vector3(x, y, z); };
            var unit = vec(1, 1, 1);
            var noRotation = new THREE.Quaternion();
            var enamelGrain = makeTexture(256, 256, function (ctx, w, h) {
                var pixels = ctx.createImageData(w, h);
                var random = randomFrom(60061);
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var a = 2 * Math.PI * x / w, b = 2 * Math.PI * y / h;
                        var cloud = Math.sin(3 * a + 2 * b) * Math.cos(2 * a - 3 * b);
                        var speckle = Math.sin(21 * a - 13 * b) * Math.cos(16 * a + 9 * b);
                        var value = 192 + 14 * cloud + 6 * speckle + 13 * (random() - 0.5);
                        var at = 4 * (y * w + x);
                        pixels.data[at] = pixels.data[at + 1] = pixels.data[at + 2] = value;
                        pixels.data[at + 3] = 255;
                    }
                }
                ctx.putImageData(pixels, 0, 0);
            });
            enamelGrain.colorSpace = THREE.NoColorSpace;
            enamelGrain.wrapS = enamelGrain.wrapT = THREE.RepeatWrapping;
            var paintGrain = enamelGrain.clone();
            paintGrain.repeat.set(9, 4);
            var enamel = function (color, roughness) { return new THREE.MeshPhysicalMaterial({
                color: color,
                roughness: roughness,
                metalness: 0.07,
                clearcoat: 0.25,
                clearcoatRoughness: 0.36,
                roughnessMap: paintGrain,
                bumpMap: paintGrain,
                bumpScale: 19e-4,
                clippingPlanes: edgePlanes,
                clipShadows: true
            }); };
            var vermilion = enamel(10895413, 0.59);
            var cream = enamel(15851453, 0.65);
            var skirt = tramMaterial(7026742, { roughness: 0.62 });
            var lowerPaint = tramMaterial(16777215, { roughness: 0.78 });
            var roof = tramMaterial(5858159, { roughness: 0.87, roughnessMap: enamelGrain, bumpMap: enamelGrain, bumpScale: 8e-3 });
            var eave = tramMaterial(8749706, { metalness: 0.25, roughness: 0.63 });
            var pewter = tramMaterial(8554640, { metalness: 0.36, roughness: 0.4 });
            var polished = tramMaterial(11443846, { metalness: 0.52, roughness: 0.34 });
            var gilt = tramMaterial(12162400, { metalness: 0.36, roughness: 0.45 });
            var rubber = tramMaterial(3487035, { roughness: 0.8 });
            var soot = tramMaterial(2107181, { roughness: 0.83 });
            var castSteel = tramMaterial(4607060, { metalness: 0.29, roughness: 0.63 });
            var tire = tramMaterial(7894904, { metalness: 0.49, roughness: 0.47 });
            var ventHood = tramMaterial(7567748, { metalness: 0.25, roughness: 0.55 });
            var porcelain = tramMaterial(9597026, { metalness: 0.05, roughness: 0.42 });
            var TramInteriorMaterial = (function (_super) {
                __extends(TramInteriorMaterial, _super);
                function TramInteriorMaterial() {
                    return Reflect.construct(_super, Array.prototype.slice.call(arguments), this.constructor);
                }
                TramInteriorMaterial.prototype.customProgramCacheKey = function () {
                    return "tram-interior-lights-v1";
                };
                TramInteriorMaterial.prototype.onBeforeCompile = function (shader) {
                    var coordinates = "varying vec3 cabinPosition;\nvarying vec3 cabinNormal;";
                    shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\n".concat(coordinates)).replace("#include <begin_vertex>", "#include <begin_vertex>\n              cabinPosition=position;\n              cabinNormal=normal;\n            ");
                    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\n            ".concat(coordinates, "\n            float fixtureFalloff(vec3 p, vec3 n, vec3 fixture) {\n              vec3 offset=fixture-p;\n              float facing=max(dot(n,normalize(offset)),0.0);\n              return (0.20+facing*0.80)/(0.24+dot(offset,offset));\n            }\n          ")).replace("#include <opaque_fragment>", "\n            float endDirection=cabinPosition.x>=0.0?1.0:-1.0;\n            vec3 p=cabinPosition-vec3(endDirection*3.05,0.0,0.0);\n            vec3 n=normalize(cabinNormal);\n            float front=p.x*endDirection;\n            float cabBlend=smoothstep(1.78,2.02,front);\n            float section=clamp(floor((p.x+1.68)/1.12),0.0,2.0);\n            float nearest=-1.12+section*1.12;\n            float xLamp=clamp(p.x,nearest-0.43,nearest+0.43);\n            float saloon=fixtureFalloff(p,n,vec3(xLamp,7.097,0.440))\n              +fixtureFalloff(p,n,vec3(xLamp,7.097,-0.440));\n            float cab=fixtureFalloff(p,n,vec3(endDirection*2.40,7.115,0.04));\n            vec3 cabinFill=mix(vec3(.22,.27,.32),vec3(.20,.24,.30),cabBlend);\n            vec3 fixtureLight=mix(vec3(1.00,.70,.43)*saloon*.45,vec3(1.00,.62,.34)*cab*.50,cabBlend);\n            float lowerShade=mix(.56,1.0,smoothstep(6.36,6.80,p.y));\n            outgoingLight=outgoingLight*.31+diffuseColor.rgb*(cabinFill+fixtureLight)*lowerShade;\n            #include <opaque_fragment>\n          ");
                };
                return TramInteriorMaterial;
            }(THREE.MeshStandardMaterial));
            var interior = function (color, options) {
                if (options === void 0) { options = {}; }
                return new TramInteriorMaterial(__spreadValues({
                    color: color,
                    roughness: 0.76,
                    clippingPlanes: edgePlanes,
                    clipShadows: true
                }, options));
            };
            var cabinWall = interior(14203285);
            var cabinWood = interior(9003084, { roughness: 0.83 });
            var upholstery = interior(4749429, { roughness: 0.93 });
            var upholsteryEdge = interior(8757908, { roughness: 0.85 });
            var cabinMetal = interior(11905429, { roughness: 0.43, metalness: 0.26 });
            var consoleMetal = interior(5265755, { roughness: 0.52 });
            var partitionGlass = interior(12693658, { transparent: true, opacity: 0.88, depthWrite: false, side: THREE.DoubleSide });
            var warmLight = tramMaterial(16769197, { emissive: 16760180, emissiveIntensity: 1.62 });
            var amberIndicator = tramMaterial(14516807, { emissive: 16742694, emissiveIntensity: 0.68 });
            var glassTile = 224, glassWidth = 4 * glassTile, glassHeight = 3 * glassTile;
            var glassOrigin = function (index) { return [index % 4 * glassTile, Math.floor(index / 4) * glassTile]; };
            var windowFilm = makeTexture(glassWidth, glassHeight, function (ctx) {
                var offsets = [-0.18, 0.63, 0.18, 0.48, 0.91, 0.3, 0.83, 0.07, 0.52, 0.27];
                for (var pane = 0; pane < offsets.length; pane++) {
                    var origin = glassOrigin(pane);
                    var pixels = ctx.createImageData(glassTile, glassTile);
                    for (var y2 = 0; y2 < glassTile; y2++) {
                        for (var x2 = 0; x2 < glassTile; x2++) {
                            var u = x2 / (glassTile - 1), v = y2 / (glassTile - 1);
                            var sky2 = Math.exp(-5.4 * v);
                            var glassSlope = 0.47 + pane % 3 * 0.11;
                            var sheen = Math.exp(-__pow((u - offsets[pane] + glassSlope * (v - 0.5)) / 0.23, 2));
                            var line = Math.exp(-__pow((u - offsets[pane] - 0.07 + glassSlope * (v - 0.5)) / 0.022, 2));
                            var warm = Math.exp(-__pow((v - 0.24 - 0.025 * Math.sin(u * 4)) / 0.071, 2)) * (0.36 + 0.36 * Math.sin(u * 2.6 + 0.52));
                            var edge = Math.exp(-14 * Math.min(u, 1 - u, v, 1 - v));
                            var alpha = 0.069 + 0.17 * sky2 + 0.13 * sheen + 0.043 * line + 0.09 * warm + 0.082 * edge;
                            var at = 4 * (y2 * glassTile + x2);
                            pixels.data[at] = 115 + 58 * sheen + 31 * sky2 + 46 * warm - 32 * edge;
                            pixels.data[at + 1] = 147 + 46 * sheen + 29 * sky2 + 14 * warm - 42 * edge;
                            pixels.data[at + 2] = 165 + 45 * sheen + 28 * sky2 - 28 * warm - 43 * edge;
                            pixels.data[at + 3] = 255 * alpha;
                        }
                    }
                    ctx.putImageData.apply(ctx, __spreadArray([pixels], __read(origin), false));
                    var _d = __read(origin, 2), x = _d[0], y = _d[1];
                    ctx.fillStyle = "#d7e1d0a0";
                    ctx.font = '600 10px "Segoe UI", sans-serif';
                    ctx.textAlign = "right";
                    ctx.fillText(pane >= 6 ? "SAFETY GLASS" : "Y\u30FB600", x + glassTile - 22, y + glassTile - 22);
                    ctx.fillStyle = "#e6e3d89a";
                    ctx.fillRect(x + glassTile - 62, y + glassTile - 16, 40, 1);
                }
            });
            var rainyFilm = makeTexture(glassWidth, glassHeight, function (ctx) {
                var rng = randomFrom(600512);
                for (var pane = 0; pane < 10; pane++) {
                    var _d = __read(glassOrigin(pane), 2), ox = _d[0], oy = _d[1];
                    ctx.save();
                    ctx.translate(ox, oy);
                    ctx.beginPath();
                    ctx.rect(0, 0, glassTile, glassTile);
                    ctx.clip();
                    for (var i = 0; i < 8; i++) {
                        var x = 12 + rng() * (glassTile - 24), y = -22 + rng() * 156;
                        var len = 26 + rng() * 72;
                        var trail = ctx.createLinearGradient(0, y, 0, y + len);
                        trail.addColorStop(0, "#b6ced100");
                        trail.addColorStop(0.65, "#b6ced17d");
                        trail.addColorStop(1, "#e5f7f789");
                        ctx.strokeStyle = trail;
                        ctx.lineWidth = 0.6 + rng() * 1.37;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.bezierCurveTo(x + 3, y + len * 0.24, x - 4, y + len * 0.69, x - 3, y + len);
                        ctx.stroke();
                    }
                    for (var i = 0; i < 89; i++) {
                        var x = 5 + rng() * (glassTile - 10), y = 6 + rng() * (glassTile - 12);
                        var radius = 0.53 + __pow(rng(), 2) * 2.35;
                        ctx.fillStyle = i % 3 ? "#b4d3d96c" : "#3e5b6b72";
                        ctx.beginPath();
                        ctx.ellipse(x, y, radius * 0.72, radius, -0.22, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#e6f0ea97";
                        ctx.fillRect(x - radius * 0.55, y - radius * 0.65, Math.max(0.6, radius * 0.73), 0.66);
                    }
                    ctx.restore();
                }
            });
            var windowRain = { value: 0 };
            var wiperPark = 0.55, wiperTravel = 0.8;
            var wiperGlass = { value: new THREE.Vector2(wiperPark, 0) };
            var TramWindowMaterial = (function (_super) {
                __extends(TramWindowMaterial, _super);
                function TramWindowMaterial() {
                    return Reflect.construct(_super, Array.prototype.slice.call(arguments), this.constructor);
                }
                TramWindowMaterial.prototype.customProgramCacheKey = function () {
                    return "tram-window-reflections-v1";
                };
                TramWindowMaterial.prototype.onBeforeCompile = function (shader) {
                    shader.uniforms.tramWindowRain = windowRain;
                    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "\n            #include <common>\n            uniform float tramWindowRain;\n          ").replace("#include <opaque_fragment>", "\n            vec3 paneEye = isOrthographic ? vec3(0.0,0.0,1.0) : normalize(vViewPosition);\n            vec3 mirror = inverseTransformDirection(reflect(-paneEye,normal),viewMatrix);\n            float grazing = 1.0 - clamp(dot(normal,paneEye),0.0,1.0);\n            grazing *= grazing;\n            vec2 paneUV = fract(vMapUv * vec2(4.0,3.0));\n            float paneNumber=floor(vMapUv.x*4.0)+4.0*floor((1.0-vMapUv.y)*3.0);\n            float cabPane=step(5.5,paneNumber);\n            float sash = smoothstep(0.054,0.20,paneUV.x) * (1.0-smoothstep(0.81,0.954,paneUV.x));\n            float topFalloff = 1.0-smoothstep(0.92,0.99,paneUV.y);\n\n            // The reflected cabin strip lives high in the glass. Its skirt is\n            // soft enough for the chairs and driver's silhouette to read below.\n            float lampY = 0.80 + 0.093*mirror.y + 0.025*mirror.x*(paneUV.x-0.5);\n            float lampDistance = (paneUV.y-lampY)/0.16;\n            float stripDistance = (paneUV.y-lampY-0.050)/0.025;\n            float fixtureReflection=0.82+0.18*cos(paneNumber*2.2);\n            float warm = sash*topFalloff*(0.19*exp(-lampDistance*lampDistance)\n              + 0.15*exp(-stripDistance*stripDistance));\n            warm *= fixtureReflection*mix(1.0,0.46,cabPane)*mix(0.84,1.07,tramWindowRain);\n\n            // The broader reflection moves during an orbit or tracking shot.\n            float sweepX = 0.54 + 0.22*mirror.x - 0.12*mirror.z;\n            float sweep = (paneUV.x-sweepX-0.32*(paneUV.y-0.5))/0.235;\n            float sky = (0.045+0.32*grazing+0.055*tramWindowRain)\n              * exp(-sweep*sweep)*smoothstep(0.18,0.74,paneUV.y);\n            sky *= mix(1.0,0.76,cabPane);\n\n            vec3 warmColor = vec3(1.22,0.61,0.27);\n            vec3 skyColor = mix(vec3(0.40,0.59,0.77),vec3(0.27,0.48,0.72),tramWindowRain);\n            vec3 paneLight = outgoingLight*diffuseColor.a;\n            paneLight = mix(paneLight,warmColor,warm);\n            paneLight = mix(paneLight,skyColor,sky);\n            diffuseColor.a = mix(mix(diffuseColor.a,1.0,warm),1.0,sky);\n            outgoingLight = paneLight/max(diffuseColor.a,0.001);\n            #include <opaque_fragment>\n          ");
                };
                return TramWindowMaterial;
            }(THREE.MeshPhysicalMaterial));
            var glazing = new TramWindowMaterial({
                color: 13162715,
                map: windowFilm,
                emissive: 7509664,
                emissiveIntensity: 0.17,
                transparent: true,
                depthWrite: false,
                roughness: 0.24,
                metalness: 0.11,
                clearcoat: 0.58,
                clearcoatRoughness: 0.2,
                clippingPlanes: edgePlanes,
                clipShadows: true
            });
            var TramWetGlassMaterial = (function (_super) {
                __extends(TramWetGlassMaterial, _super);
                function TramWetGlassMaterial() {
                    return Reflect.construct(_super, Array.prototype.slice.call(arguments), this.constructor);
                }
                TramWetGlassMaterial.prototype.customProgramCacheKey = function () {
                    return "tram-wet-glass-v1";
                };
                TramWetGlassMaterial.prototype.onBeforeCompile = function (shader) {
                    shader.uniforms.tramWetness = windowRain;
                    shader.uniforms.tramWiper = wiperGlass;
                    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\n            uniform float tramWetness;\n            uniform vec2 tramWiper;\n          ").replace("#include <alphatest_fragment>", "\n            vec2 windUV=fract(vMapUv*vec2(4.0,3.0));\n            float windTile=floor(vMapUv.x*4.0)+4.0*floor((1.0-vMapUv.y)*3.0);\n            // Use the same origin and angular sweep as the physical blades.\n            float leading=step(5.5,windTile)*(1.0-step(7.5,windTile));\n            vec2 fromPivot=vec2((windUV.x-.24)*.379,(windUV.y-.052)*.513);\n            float radius=length(fromPivot);\n            float angle=atan(fromPivot.y,max(0.0001,fromPivot.x));\n            float arc=smoothstep(.48,.57,angle)*(1.0-smoothstep(tramWiper.x,tramWiper.x+.045,angle));\n            float sweep=leading*arc*smoothstep(.105,.128,radius)\n              *(1.0-smoothstep(.269,.287,radius))*tramWiper.y*step(0.0,fromPivot.x);\n            diffuseColor.a*=tramWetness*(.93-.80*sweep);\n            #include <alphatest_fragment>\n          ");
                };
                return TramWetGlassMaterial;
            }(THREE.MeshStandardMaterial));
            var wetGlass = new TramWetGlassMaterial({
                color: 13162458,
                map: rainyFilm,
                emissive: 7113369,
                emissiveIntensity: 0.34,
                transparent: true,
                depthWrite: false,
                roughness: 0.38,
                clippingPlanes: edgePlanes,
                clipShadows: true
            });
            var wetWindowMeshes = [];
            var surfaces = new Map();
            var hardware = new Map();
            var matrix2 = new THREE.Matrix4();
            function surface(finish, casts, order) {
                var key = "".concat(finish.id, "/").concat(casts, "/").concat(order);
                if (!surfaces.has(key)) {
                    surfaces.set(key, { finish: finish, casts: casts, order: order, points: [], normals: [], uvs: [], triangles: [] });
                }
                return surfaces.get(key);
            }
            function grid(finish, cols, rows, vertexAt, _d) {
                var _e;
                var _f = _d === void 0 ? {} : _d, _g = _f.casts, casts = _g === void 0 ? true : _g, _h = _f.order, order = _h === void 0 ? 0 : _h;
                var target = surface(finish, casts, order);
                var start = target.points.length / 3;
                for (var j = 0; j <= rows; j++) {
                    for (var i = 0; i <= cols; i++) {
                        var _j = vertexAt(i / cols, j / rows), p = _j.p, n = _j.n, uv = _j.uv;
                        target.points.push(p.x, p.y, p.z);
                        if (n)
                            target.normals.push(n.x, n.y, n.z);
                        else
                            target.normals.push(0, 0, 0);
                        (_e = target.uvs).push.apply(_e, __spreadArray([], __read(uv), false));
                    }
                }
                for (var j = 0; j < rows; j++) {
                    for (var i = 0; i < cols; i++) {
                        var a = start + j * (cols + 1) + i, b = a + 1, c = a + cols + 1, d = c + 1;
                        target.triangles.push(a, b, c, b, d, c);
                    }
                }
            }
            function addHardware(finish, geometry, at, rotation, scale, casts) {
                if (rotation === void 0) { rotation = noRotation; }
                if (scale === void 0) { scale = unit; }
                if (casts === void 0) { casts = false; }
                var key = "".concat(finish.id, "/").concat(casts);
                if (!hardware.has(key))
                    hardware.set(key, { finish: finish, casts: casts, parts: [] });
                var copy = geometry.clone();
                matrix2.compose(vec.apply(void 0, __spreadArray([], __read(at), false)), rotation, scale);
                copy.applyMatrix4(matrix2);
                hardware.get(key).parts.push(copy);
            }
            var sphere = new THREE.SphereGeometry(1, 32, 18);
            var rod2 = new THREE.CylinderGeometry(1, 1, 1, 24);
            var boltHead = new THREE.CylinderGeometry(1, 1, 1, 6);
            function capsule(finish, at, size, rotation, casts) {
                if (rotation === void 0) { rotation = noRotation; }
                if (casts === void 0) { casts = false; }
                addHardware(finish, sphere, at, rotation, vec.apply(void 0, __spreadArray([], __read(size), false)), casts);
            }
            function pin(finish, radius, len, at, axis, geometry, casts) {
                if (geometry === void 0) { geometry = rod2; }
                if (casts === void 0) { casts = false; }
                var rotation = new THREE.Quaternion().setFromUnitVectors(unitY, vec.apply(void 0, __spreadArray([], __read(axis), false)).normalize());
                addHardware(finish, geometry, at, rotation, vec(radius, len, radius), casts);
            }
            function link(finish, radius, from, to, casts) {
                if (casts === void 0) { casts = false; }
                var a = vec.apply(void 0, __spreadArray([], __read(from), false)), b = vec.apply(void 0, __spreadArray([], __read(to), false));
                var direction = b.clone().sub(a);
                pin(finish, radius, direction.length(), a.lerp(b, 0.5).toArray(), direction.toArray(), rod2, casts);
            }
            function flex(finish, points, radius, segments, casts) {
                if (segments === void 0) { segments = 22; }
                if (casts === void 0) { casts = false; }
                var curve = new THREE.CatmullRomCurve3(points.map(function (p) { return vec.apply(void 0, __spreadArray([], __read(p), false)); }));
                var geometry = new THREE.TubeGeometry(curve, segments, radius, 10, false);
                addHardware(finish, geometry, [0, 0, 0], noRotation, unit, casts);
                geometry.dispose();
            }
            var fillets = new Map();
            function filletBox(w, h, d, radius) {
                var key = [w, h, d, radius].join("/");
                if (fillets.has(key))
                    return fillets.get(key);
                var radiusLimit = Math.min(w, h, d) * 0.49;
                var r = Math.min(radius, radiusLimit);
                var segments = r < 8e-3 ? 3 : r < 0.028 ? 5 : 7;
                var geometry = new THREE.BoxGeometry(2, 2, 2, segments, segments, segments);
                var _d = geometry.attributes, position = _d.position, normal = _d.normal;
                var center = vec(w / 2 - r, h / 2 - r, d / 2 - r);
                var p = vec(0, 0, 0), n = vec(0, 0, 0);
                for (var i = 0; i < position.count; i++) {
                    p.fromBufferAttribute(position, i);
                    var signX = Math.sign(p.x), signY = Math.sign(p.y), signZ = Math.sign(p.z);
                    n.set(p.x - signX / segments, p.y - signY / segments, p.z - signZ / segments).normalize();
                    position.setXYZ(i, center.x * signX + r * n.x, center.y * signY + r * n.y, center.z * signZ + r * n.z);
                    normal.setXYZ(i, n.x, n.y, n.z);
                }
                fillets.set(key, geometry);
                return geometry;
            }
            function casting(finish, at, size, radius, yaw, casts) {
                if (yaw === void 0) { yaw = 0; }
                if (casts === void 0) { casts = false; }
                var rotation = yaw === 0 ? noRotation : new THREE.Quaternion().setFromAxisAngle(unitY, yaw);
                addHardware(finish, filletBox.apply(void 0, __spreadArray(__spreadArray([], __read(size), false), [radius], false)), at, rotation, unit, casts);
            }
            function lathe(profile, segments) {
                if (segments === void 0) { segments = 48; }
                return new THREE.LatheGeometry(profile.map(function (_d) {
                    var _e = __read(_d, 2), r = _e[0], y = _e[1];
                    return new THREE.Vector2(r, y);
                }), segments);
            }
            function axial(finish, geometry, at, direction, casts) {
                if (casts === void 0) { casts = false; }
                var rotation = new THREE.Quaternion().setFromUnitVectors(unitY, vec.apply(void 0, __spreadArray([], __read(direction), false)));
                addHardware(finish, geometry, at, rotation, unit, casts);
            }
            function exteriorDimensions(y) {
                var tuck = 1 - smooth(y, 5.72, 5.985);
                var tumble = smooth(y, 6.62, roofSpring);
                var rake = 0.042 * smooth(y, 6.41, roofSpring);
                return {
                    x: bodyEnd - 0.055 * tuck - rake,
                    z: sideZ - 0.071 * tuck - 0.023 * tumble,
                    cx: cornerX - rake,
                    cz: cornerZ - 8e-3 * tumble,
                    bow: 0.014 - 4e-3 * tuck - 0.03 * rake
                };
            }
            var roofProfile = new THREE.CatmullRomCurve3([
                [0, 0, 1],
                [-0.034, 0.032, 1.043],
                [-0.03, 0.081, 1.041],
                [0.012, 0.116, 0.997],
                [0.034, 0.13, 0.96],
                [0.039, 0.175, 0.95],
                [0.077, 0.243, 0.901],
                [0.146, 0.281, 0.805],
                [0.158, 0.292, 0.513],
                [0.167, 0.299, 0.248],
                [0.172, 0.301, 0]
            ].map(function (p) { return vec.apply(void 0, __spreadArray([], __read(p), false)); }), false, "catmullrom", 0.5);
            var roofBase = exteriorDimensions(roofSpring);
            var roofSpan = 3.1, roofHalfWidth = 0.875;
            var roofWear = makeTexture(1024, 560, function (ctx, w, h) {
                var e_311, _d;
                var rng = randomFrom(63514);
                var strip = h / 2;
                var _loop_22 = function (cab) {
                    var e_312, _g, e_313, _h;
                    var row = cab > 0 ? 0 : strip;
                    var toX = function (x) { return (0.5 + x / (2 * roofSpan)) * w; };
                    var toY = function (z) { return row + (0.5 + z / (2 * roofHalfWidth)) * strip; };
                    var fade = ctx.createLinearGradient(0, row, 0, row + strip);
                    fade.addColorStop(0, "#555a65");
                    fade.addColorStop(0.2, "#606770");
                    fade.addColorStop(0.52, "#71747b");
                    fade.addColorStop(0.8, "#656b73");
                    fade.addColorStop(1, "#50545d");
                    ctx.fillStyle = fade;
                    ctx.fillRect(0, row, w, strip);
                    try {
                        for (var _j = (e_312 = void 0, __values([
                            [cab * 1.55, 0.02, 133, 82, 0.62],
                            [-cab * 1.54, -0.02, 121, 57, 0.54],
                            [-0.26, -0.17, 114, 64, cab > 0 ? 0.55 : 0.29],
                            [cab * 2.26, 0.16, 106, 68, 0.24]
                        ])), _k = _j.next(); !_k.done; _k = _j.next()) {
                            var _l = __read(_k.value, 5), x = _l[0], z = _l[1], width = _l[2], depth = _l[3], alpha = _l[4];
                            ctx.save();
                            ctx.translate(toX(x), toY(z));
                            ctx.scale(width, depth);
                            var haze = ctx.createRadialGradient(0, 0, 0.08, 0, 0, 1);
                            haze.addColorStop(0, "rgba(55,49,49,".concat(alpha, ")"));
                            haze.addColorStop(0.52, "rgba(67,59,53,".concat(alpha * 0.56, ")"));
                            haze.addColorStop(1, "rgba(74,64,55,0)");
                            ctx.fillStyle = haze;
                            ctx.fillRect(-1, -1, 2, 2);
                            ctx.restore();
                        }
                    }
                    catch (e_312_1) { e_312 = { error: e_312_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_g = _j.return)) _g.call(_j);
                        }
                        finally { if (e_312) throw e_312.error; }
                    }
                    try {
                        for (var _m = (e_313 = void 0, __values([-2.04, -0.82, 0.82, 2.04])), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var x = _o.value;
                            var seam = ctx.createLinearGradient(0, toY(-0.71), 0, toY(0.71));
                            seam.addColorStop(0, "#372e2e00");
                            seam.addColorStop(0.19, "#3437406f");
                            seam.addColorStop(0.68, "#3136435d");
                            seam.addColorStop(1, "#473c3400");
                            ctx.fillStyle = seam;
                            ctx.fillRect(toX(x), toY(-0.71), 1.25, toY(0.71) - toY(-0.71));
                            ctx.fillStyle = "#adaca72c";
                            ctx.fillRect(toX(x) + 1.32, toY(-0.52), 0.8, toY(0.58) - toY(-0.52));
                        }
                    }
                    catch (e_313_1) { e_313 = { error: e_313_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_h = _m.return)) _h.call(_m);
                        }
                        finally { if (e_313) throw e_313.error; }
                    }
                    for (var i = 0; i < 720; i++) {
                        ctx.fillStyle = i % 3 ? "#aaa59a25" : "#3c3b4250";
                        ctx.fillRect(rng() * w, row + 4 + rng() * (strip - 8), 0.7 + 2.1 * rng(), 0.4 + 1.4 * rng());
                    }
                };
                try {
                    for (var _e = __values([1, -1]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var cab = _f.value;
                        _loop_22(cab);
                    }
                }
                catch (e_311_1) { e_311 = { error: e_311_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_311) throw e_311.error; }
                }
            });
            roof.map = roofWear;
            roof.color.set(16777215);
            function roofUv(carX, cab, p) {
                return [0.5 + (p.x - carX) / (roofSpan * 2), 1 - ((cab > 0 ? 0 : 0.5) + (0.5 + p.z / (roofHalfWidth * 2)) * 0.5)];
            }
            function chamferProgress(t) {
                var fillet = 0.175;
                if (t < 0)
                    return [2 * t, 0];
                if (t > 1)
                    return [1, 2 * t - 1];
                var d = Math.min(t, 1 - t, fillet);
                var round = d - d * d / (2 * fillet);
                return [t + round, t - round];
            }
            var faces = [];
            var _loop_21 = function (s) {
                var e_314, _z;
                faces.push({
                    kind: "side",
                    side: s,
                    half: bodyEnd - cornerX,
                    xz: function (q, d) { return [s * q * (d.x - d.cx), s * d.z]; }
                });
                faces.push({
                    kind: "end",
                    end: s,
                    half: sideZ - cornerZ,
                    xz: function (q, d) { return [s * (d.x + d.bow * __pow(1 - q * q, 2)), -s * q * (d.z - d.cz)]; }
                });
                var _loop_23 = function (z) {
                    var half = 0.56 * Math.hypot(cornerX, cornerZ);
                    faces.push({
                        kind: "corner",
                        end: s,
                        side: z,
                        half: half,
                        xz: function (q, d) {
                            var _d = __read(chamferProgress((1 + s * z * q) / 2), 2), forward = _d[0], inset = _d[1];
                            return [s * (d.x - d.cx + d.cx * forward), z * (d.z - d.cz * inset)];
                        }
                    });
                };
                try {
                    for (var _0 = (e_314 = void 0, __values([-1, 1])), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                        var z = _1.value;
                        _loop_23(z);
                    }
                }
                catch (e_314_1) { e_314 = { error: e_314_1 }; }
                finally {
                    try {
                        if (_1 && !_1.done && (_z = _0.return)) _z.call(_0);
                    }
                    finally { if (e_314) throw e_314.error; }
                }
            };
            try {
                for (var _m = __values([-1, 1]), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var s = _o.value;
                    _loop_21(s);
                }
            }
            catch (e_303_1) { e_303 = { error: e_303_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                }
                finally { if (e_303) throw e_303.error; }
            }
            var paintWidth = 2048, paintHeight = 672, paintRowHeight = paintHeight / 2;
            var paintLow = 5.696, paintHigh = 7.287;
            var pad = 4;
            var sumWidths = faces.reduce(function (sum, face) { return sum + 2 * face.half; }, 0);
            var paintX = 0, paintContext;
            try {
                for (var faces_2 = __values(faces), faces_2_1 = faces_2.next(); !faces_2_1.done; faces_2_1 = faces_2.next()) {
                    var face = faces_2_1.value;
                    face.paintWidth = Math.floor(2 * face.half / sumWidths * (paintWidth - faces.length * 2 * pad));
                    face.paintX = paintX + pad;
                    paintX += face.paintWidth + 2 * pad;
                }
            }
            catch (e_304_1) { e_304 = { error: e_304_1 }; }
            finally {
                try {
                    if (faces_2_1 && !faces_2_1.done && (_e = faces_2.return)) _e.call(faces_2);
                }
                finally { if (e_304) throw e_304.error; }
            }
            var paintAtlas = makeTexture(paintWidth, paintHeight, function (ctx) {
                paintContext = ctx;
            });
            try {
                for (var _p = __values([vermilion, cream, lowerPaint]), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var finish = _q.value;
                    finish.map = paintAtlas;
                    finish.color.set(16777215);
                }
            }
            catch (e_305_1) { e_305 = { error: e_305_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_f = _p.return)) _f.call(_p);
                }
                finally { if (e_305) throw e_305.error; }
            }
            function paintCoordinates(face, cab) {
                var row = (cab > 0 ? 0 : 1) * paintRowHeight + pad;
                var usable = paintRowHeight - 2 * pad;
                var px = function (u) { return face.paintX + (u / face.half + 1) * 0.5 * face.paintWidth; };
                var py = function (y) { return row + (paintHigh - y) / (paintHigh - paintLow) * usable; };
                return { px: px, py: py, row: row, usable: usable, uv: function (u, y) { return [px(u) / paintWidth, 1 - py(y) / paintHeight]; } };
            }
            function paintPanel(face, cab, windows, front) {
                var e_315, _d, e_316, _e, e_317, _f, e_318, _g, e_319, _h;
                var _j = paintCoordinates(face, cab), px = _j.px, py = _j.py, row = _j.row, usable = _j.usable, uv = _j.uv;
                var ctx = paintContext;
                var left = face.paintX - pad, right = face.paintX + face.paintWidth + pad;
                var rng = randomFrom(60511 + face.paintX + 163 * (cab > 0 ? 1 : 0));
                ctx.save();
                ctx.beginPath();
                ctx.rect(left, row - pad, right - left, usable + 2 * pad);
                ctx.clip();
                ctx.fillStyle = "#f1dfbd";
                ctx.fillRect(left, row - pad, right - left, usable + 2 * pad);
                var red = ctx.createLinearGradient(0, py(6.347), 0, py(5.728));
                red.addColorStop(0, "#a8463a");
                red.addColorStop(0.28, "#a9473d");
                red.addColorStop(0.7, "#a04035");
                red.addColorStop(1, "#773633");
                ctx.fillStyle = red;
                ctx.fillRect(left, py(6.347), right - left, py(5.879) - py(6.347));
                ctx.fillStyle = "#613634";
                ctx.fillRect(left, py(5.879), right - left, usable + pad + row - py(5.879));
                var dust = ctx.createLinearGradient(0, py(6.14), 0, py(5.745));
                dust.addColorStop(0, "#79645500");
                dust.addColorStop(0.43, "#78665517");
                dust.addColorStop(0.82, "#63574a68");
                dust.addColorStop(1, "#423b37a5");
                ctx.fillStyle = dust;
                ctx.fillRect(left, py(6.14), right - left, usable + row + pad - py(6.14));
                function streak(u, y, len, width, alpha) {
                    var x = px(u), head = py(y), bottom = py(y - len);
                    var smear = ctx.createLinearGradient(0, head, 0, bottom);
                    smear.addColorStop(0, "rgba(94,70,52,".concat(alpha, ")"));
                    smear.addColorStop(0.42, "rgba(99,77,60,".concat(alpha * 0.65, ")"));
                    smear.addColorStop(1, "rgba(99,77,60,0)");
                    ctx.fillStyle = smear;
                    ctx.beginPath();
                    ctx.moveTo(x - width / 2, head);
                    ctx.lineTo(x + width * 0.63, head);
                    ctx.bezierCurveTo(x + width * 0.42, head + len * 70, x + width * 0.22, bottom - 4, x - width * 0.13, bottom);
                    ctx.bezierCurveTo(x - width * 0.52, bottom - 9, x - width * 0.31, head + len * 60, x - width / 2, head);
                    ctx.fill();
                }
                try {
                    for (var windows_1 = __values(windows), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()) {
                        var wnd = windows_1_1.value;
                        var base = wnd.y - wnd.h / 2;
                        var width = px(wnd.right) - px(wnd.left);
                        streak(wnd.u - wnd.w * 0.29, base - 0.02, 0.108 + rng() * 0.13, 1.8 + width * 0.028, 0.23 + rng() * 0.09);
                        if (rng() > 0.2)
                            streak(wnd.u + wnd.w * 0.32, base - 0.028, 0.06 + rng() * 0.12, 1 + width * 0.02, 0.15 + rng() * 0.09);
                    }
                }
                catch (e_315_1) { e_315 = { error: e_315_1 }; }
                finally {
                    try {
                        if (windows_1_1 && !windows_1_1.done && (_d = windows_1.return)) _d.call(windows_1);
                    }
                    finally { if (e_315) throw e_315.error; }
                }
                for (var i = 0; i < face.paintWidth * 0.74; i++) {
                    var x = left + rng() * (right - left), y = py(5.738 + __pow(rng(), 2) * 0.324);
                    ctx.fillStyle = rng() > 0.43 ? "#c0ad8c38" : "#423b3956";
                    ctx.fillRect(x, y, 0.4 + rng() * 1.8, 0.55 + rng() * 1.65);
                }
                if (face.kind === "side") {
                    try {
                        for (var _k = __values([-2.19, 2.19]), _l = _k.next(); !_l.done; _l = _k.next()) {
                            var door = _l.value;
                            try {
                                for (var _m = (e_317 = void 0, __values([-0.337, 0.337])), _o = _m.next(); !_o.done; _o = _m.next()) {
                                    var edge = _o.value;
                                    streak(door + edge, 6.045, 0.142, 3.6, 0.32);
                                    for (var i = 0; i < 15; i++) {
                                        var x = px(door + edge) + (rng() - 0.5) * 7, y = py(5.928 + __pow(rng(), 1.4) * 0.127);
                                        ctx.fillStyle = i % 3 === 0 ? "#d1b9938c" : "#583f3384";
                                        ctx.fillRect(x, y, 0.65 + rng() * 2.35, 0.5 + rng() * 1.75);
                                    }
                                }
                            }
                            catch (e_317_1) { e_317 = { error: e_317_1 }; }
                            finally {
                                try {
                                    if (_o && !_o.done && (_f = _m.return)) _f.call(_m);
                                }
                                finally { if (e_317) throw e_317.error; }
                            }
                            try {
                                for (var _p = (e_318 = void 0, __values([door - 0.066, door + 0.066])), _q = _p.next(); !_q.done; _q = _p.next()) {
                                    var u = _q.value;
                                    var smudge = ctx.createRadialGradient(px(u), py(6.445), 0.4, px(u), py(6.445), 12);
                                    smudge.addColorStop(0, "#9a765b69");
                                    smudge.addColorStop(1, "#9a765b00");
                                    ctx.fillStyle = smudge;
                                    ctx.fillRect(px(u) - 12, py(6.445) - 12, 24, 24);
                                }
                            }
                            catch (e_318_1) { e_318 = { error: e_318_1 }; }
                            finally {
                                try {
                                    if (_q && !_q.done && (_g = _p.return)) _g.call(_p);
                                }
                                finally { if (e_318) throw e_318.error; }
                            }
                        }
                    }
                    catch (e_316_1) { e_316 = { error: e_316_1 }; }
                    finally {
                        try {
                            if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                        }
                        finally { if (e_316) throw e_316.error; }
                    }
                }
                if (front) {
                    try {
                        for (var _r = __values([-lampOffset, lampOffset]), _s = _r.next(); !_s.done; _s = _r.next()) {
                            var z = _s.value;
                            var u = z * face.half / (lampD.z - lampD.cz);
                            streak(u, 6.006, 0.138, 3.4, 0.27);
                            for (var i = 0; i < 10; i++) {
                                ctx.fillStyle = i % 3 ? "#653b3263" : "#d5ad8077";
                                ctx.fillRect(px(u) + (rng() - 0.5) * 18, py(5.93) + (rng() - 0.5) * 13, 1 + rng() * 1.8, 0.5 + rng() * 1.6);
                            }
                        }
                    }
                    catch (e_319_1) { e_319 = { error: e_319_1 }; }
                    finally {
                        try {
                            if (_s && !_s.done && (_h = _r.return)) _h.call(_r);
                        }
                        finally { if (e_319) throw e_319.error; }
                    }
                }
                ctx.restore();
                return uv;
            }
            function bindFace(face, carX) {
                function place2(u, y, d, offset) {
                    var q = u / face.half;
                    var _d = __read(face.xz(q, d), 2), x = _d[0], z = _d[1];
                    if (!offset)
                        return vec(carX + x, y, z);
                    var _e = __read(face.xz(q - 1e-3, d), 2), x0 = _e[0], z0 = _e[1], _f = __read(face.xz(q + 1e-3, d), 2), x1 = _f[0], z1 = _f[1];
                    var length = Math.hypot(x1 - x0, z1 - z0);
                    return vec(carX + x - offset * (z1 - z0) / length, y, z + offset * (x1 - x0) / length);
                }
                return __spreadProps(__spreadValues({}, face), {
                    point: function (u, y, offset) {
                        if (offset === void 0) { offset = 0; }
                        return place2(u, y, exteriorDimensions(y), offset);
                    },
                    crown: function (u, t) {
                        var _d = roofProfile.getPoint(THREE.MathUtils.clamp(t, 0, 1)), inset = _d.x, height = _d.y, width = _d.z;
                        var dims = {
                            x: roofBase.x - inset,
                            z: roofBase.z * width,
                            cx: roofBase.cx * (0.84 + 0.16 * width),
                            cz: roofBase.cz * width,
                            bow: roofBase.bow * width
                        };
                        return place2(u, roofSpring + height, dims, 0);
                    }
                });
            }
            var defaultUv = function (u, v) { return [0.83 * u, 0.84 * v]; };
            function curvedPatch(finish, evaluator, u0, u1, lo, hi, rows, options) {
                if (options === void 0) { options = {}; }
                var _a, _b;
                var columns = Math.max(1, Math.ceil((u1 - u0) / ((_a = options.pitch) != null ? _a : 0.07)));
                var uv = (_b = options.uv) != null ? _b : defaultUv;
                grid(finish, columns, rows, function (s, t) {
                    var _a2;
                    var u = THREE.MathUtils.lerp(u0, u1, s);
                    var v = THREE.MathUtils.lerp(lo(u), hi(u), t);
                    var p = evaluator(u, v);
                    var sample = Math.min(v, (_a2 = options.normalLimit) != null ? _a2 : Infinity);
                    var du = evaluator(u + 4e-4, sample).sub(evaluator(u - 4e-4, sample));
                    var dv = evaluator(u, sample + 4e-4).sub(evaluator(u, sample - 4e-4));
                    return { p: p, n: du.cross(dv).normalize(), uv: uv(u, v, p) };
                }, options);
            }
            var level = function (y) { return function () { return y; }; };
            function skinStrip(face, finish, u0, u1, low, high, depth, options) {
                if (depth === void 0) { depth = 0; }
                if (options === void 0) { options = {}; }
                if (u1 - u0 < 1e-4 || high - low < 1e-4)
                    return;
                curvedPatch(finish, function (u, y) { return face.point(u, y, depth); }, u0, u1, level(low), level(high), Math.max(1, Math.ceil((high - low) / 0.037)), options);
            }
            function roundedWindow(u, y, w, h, r, slider) {
                if (slider === void 0) { slider = false; }
                return { u: u, y: y, w: w, h: h, r: r, slider: slider, left: u - w / 2, right: u + w / 2 };
            }
            function windowEdges(wnd, u) {
                var cut = Math.max(0, Math.abs(u - wnd.u) - wnd.w / 2 + wnd.r);
                var lift = wnd.r - Math.sqrt(Math.max(0, __pow(wnd.r, 2) - __pow(cut, 2)));
                return [wnd.y - wnd.h / 2 + lift, wnd.y + wnd.h / 2 - lift];
            }
            function windowColumns(wnd) {
                var steps = 6;
                var cells = [wnd.left];
                for (var i = 1; i <= steps; i++)
                    cells.push(wnd.left + wnd.r * (1 - Math.cos(i * Math.PI / (2 * steps))));
                cells.push(wnd.right - wnd.r);
                for (var i = steps - 1; i >= 0; i--)
                    cells.push(wnd.right - wnd.r * (1 - Math.cos(i * Math.PI / (2 * steps))));
                return cells;
            }
            function roundedOutline(wnd, grow) {
                var u = wnd.u, y = wnd.y, w = wnd.w, h = wnd.h, r = wnd.r;
                var loops = [[1, 1, 0], [-1, 1, 1], [-1, -1, 2], [1, -1, 3]].map(function (_d) {
                    var _e = __read(_d, 3), sx = _e[0], sy = _e[1], quarter = _e[2];
                    var cx = u + sx * (w / 2 - r), cy = y + sy * (h / 2 - r);
                    return Array.from({ length: 9 }, function (_, step) {
                        var angle = (quarter + step / 8) * Math.PI / 2;
                        return [cx + (r + grow) * Math.cos(angle), cy + (r + grow) * Math.sin(angle)];
                    });
                });
                var vertices = [];
                var _loop_24 = function (i) {
                    var from = loops[i].at(-1), to = loops[(i + 1) % 4][0];
                    vertices.push.apply(vertices, __spreadArray([], __read(loops[i]), false));
                    var _loop_25 = function (j) {
                        vertices.push(from.map(function (v, k) { return THREE.MathUtils.lerp(v, to[k], j / 6); }));
                    };
                    for (var j = 1; j < 6; j++) {
                        _loop_25(j);
                    }
                };
                for (var i = 0; i < 4; i++) {
                    _loop_24(i);
                }
                return __spreadArray(__spreadArray([], __read(vertices), false), [vertices[0]], false);
            }
            function rim(face, wnd, finish, layers) {
                var loops = layers.map(function (_d) {
                    var _e = __read(_d, 1), grow = _e[0];
                    return roundedOutline(wnd, grow);
                });
                var cols = loops[0].length - 1, rows = loops.length - 1;
                grid(finish, cols, rows, function (s, t) {
                    var row = Math.round(t * rows), col = Math.round(s * cols);
                    var _d = __read(loops[row][col], 2), u = _d[0], y = _d[1];
                    return { p: face.point(u, y, layers[row][1]), uv: defaultUv(u, y) };
                }, { casts: false });
            }
            function fitWindowSash(face, wnd) {
                var e_320, _d, e_321, _e;
                var sill = wnd.y - wnd.h / 2;
                var width = wnd.w;
                rim(face, wnd, polished, [[0.017, -2e-3], [0.015, 4e-3], [0.01, 0.011], [0, 0.011], [-4e-3, 4e-3]]);
                rim(face, wnd, rubber, [[1e-3, 4e-3], [-7e-3, 1e-3], [-0.011, -0.017], [-0.011, -0.041]]);
                rim(face, wnd, pewter, [[-9e-3, -0.033], [-0.016, -0.025], [-0.02, -0.033]]);
                if (face.kind === "side") {
                    var lipLeft = wnd.left + wnd.r * 0.55, lipRight = wnd.right - wnd.r * 0.55;
                    skinStrip(face, pewter, lipLeft, lipRight, sill - 0.017, sill - 7e-3, 0.015, { casts: false });
                    skinStrip(face, polished, lipLeft + 0.014, lipRight - 0.014, sill - 0.01, sill - 7e-3, 0.019, { casts: false });
                    try {
                        for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var side = _g.value;
                            var u = wnd.u + side * (width * 0.5 - wnd.r - 0.013);
                            skinStrip(face, rubber, u - 0.011, u + 0.011, sill - 0.018, sill - 0.01, 0.017, { casts: false });
                        }
                    }
                    catch (e_320_1) { e_320 = { error: e_320_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                        }
                        finally { if (e_320) throw e_320.error; }
                    }
                }
                if (!wnd.slider)
                    return;
                var transom = wnd.y + wnd.h * 0.247;
                var mid = wnd.u + 0.043;
                skinStrip(face, rubber, wnd.left + 0.012, wnd.right - 0.012, transom - 7e-3, transom + 0.011, -0.011, { casts: false });
                skinStrip(face, polished, wnd.left + 0.013, wnd.right - 0.013, transom - 2e-3, transom + 7e-3, -2e-3, { casts: false });
                skinStrip(face, pewter, mid - 6e-3, mid + 6e-3, sill + 0.014, transom - 2e-3, -0.014, { casts: false });
                skinStrip(face, rubber, mid + 6e-3, mid + 0.01, sill + 0.014, transom - 5e-3, -0.016, { casts: false });
                skinStrip(face, polished, wnd.left + 0.03, wnd.right - 0.029, sill + 0.013, sill + 0.019, -0.027, { casts: false });
                var latch = face.point(mid + 0.013, sill + 0.049, -0.015).toArray();
                casting(rubber, latch, [0.021, 0.033, 0.019], 7e-3);
                casting(polished, face.point(mid + 0.012, sill + 0.05, -3e-3).toArray(), [0.026, 0.01, 0.011], 3e-3);
                try {
                    for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var side = _j.value;
                        var x = wnd.u + side * (width / 2 - wnd.r - 4e-3);
                        pin(pewter, 6e-3, 9e-3, face.point(x, transom + 3e-3, 1e-3).toArray(), [0, 0, face.side], boltHead);
                    }
                }
                catch (e_321_1) { e_321 = { error: e_321_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_321) throw e_321.error; }
                }
            }
            function skinWithWindows(face, windows, paintUv, cab) {
                var e_322, _d;
                var low = 6.347, high = roofSpring;
                var prev = -face.half;
                var _loop_26 = function (index, wnd) {
                    skinStrip(face, cream, prev, wnd.left, low, high, 0, { uv: paintUv });
                    var bottom = function (u) { return windowEdges(wnd, u)[0]; };
                    var top = function (u) { return windowEdges(wnd, u)[1]; };
                    var tile = face.kind === "end" ? index % 2 + (cab > 0 ? 6 : 8) : (index + (cab > 0 ? 1 : 3) + (face.side > 0 ? 0 : 2)) % 6;
                    var _h = __read(glassOrigin(tile), 2), px = _h[0], py = _h[1];
                    var margin = 2;
                    var usable = glassTile - 2 * margin;
                    var uv = function (u, y) { return [
                        (px + margin + (u - wnd.left) / wnd.w * usable) / glassWidth,
                        1 - (py + margin + (0.5 - (y - wnd.y) / wnd.h) * usable) / glassHeight
                    ]; };
                    var paneOptions = { casts: false, order: 2, uv: uv };
                    var cuts = windowColumns(wnd);
                    for (var n = 1; n < cuts.length; n++) {
                        var left = cuts[n - 1], right = cuts[n];
                        curvedPatch(cream, face.point, left, right, level(low), bottom, 5, { uv: paintUv });
                        curvedPatch(cream, face.point, left, right, top, level(high), 5, { uv: paintUv });
                        curvedPatch(glazing, function (u, y) { return face.point(u, y, -0.034); }, left, right, bottom, top, 5, paneOptions);
                    }
                    fitWindowSash(face, wnd);
                    prev = wnd.right;
                };
                try {
                    for (var _e = __values(windows.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 2), index = _g[0], wnd = _g[1];
                        _loop_26(index, wnd);
                    }
                }
                catch (e_322_1) { e_322 = { error: e_322_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_322) throw e_322.error; }
                }
                skinStrip(face, cream, prev, face.half, low, high, 0, { uv: paintUv });
            }
            var stencil = function (map) { return tramMaterial(16777215, { map: map, alphaTest: 0.45, roughness: 0.66 }); };
            var fleetInsignia = stencil(makeTexture(768, 256, function (ctx, w, h) {
                var e_323, _d;
                ctx.fillStyle = "#efd6aa";
                ctx.strokeStyle = "#efd6aa";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.arc(123, 128, 76, 0, 2 * Math.PI);
                ctx.stroke();
                try {
                    for (var _e = __values([-20, 4, 28]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var offset = _f.value;
                        ctx.beginPath();
                        ctx.moveTo(73, 114 + offset);
                        ctx.bezierCurveTo(112, 74 + offset, 139, 148 + offset, 173, 109 + offset);
                        ctx.stroke();
                    }
                }
                catch (e_323_1) { e_323 = { error: e_323_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_323) throw e_323.error; }
                }
                ctx.font = 'bold 103px "Yu Gothic", Meiryo, sans-serif';
                ctx.fillText("\u5915\u51EA\u96FB\u9244", 241, 139);
                ctx.font = '600 35px "Segoe UI", sans-serif';
                ctx.fillText("Y U N A G I   E L E C T R I C", 247, 200);
            }));
            function numberStencil(number) {
                return stencil(makeTexture(256, 128, function (ctx, w, h) {
                    ctx.fillStyle = "#f4dfb7";
                    ctx.font = 'bold 91px "Segoe UI", sans-serif';
                    ctx.textAlign = "center";
                    ctx.fillText(number, w / 2, 98);
                }));
            }
            var accessStencil = stencil(makeTexture(192, 112, function (ctx, w, h) {
                ctx.fillStyle = "#f1d9ae";
                ctx.font = '700 36px "Yu Gothic", sans-serif';
                ctx.textAlign = "center";
                ctx.fillText("\u4E57 \u8ECA \u53E3", w / 2, 47);
                ctx.fillStyle = "#f1d9a6";
                ctx.fillRect(33, 66, 126, 6);
                ctx.beginPath();
                ctx.moveTo(86, 71);
                ctx.lineTo(96, 89);
                ctx.lineTo(106, 71);
                ctx.fill();
            }));
            var lineSignMap = makeTexture(768, 168, function (ctx, w, h) {
                var shade = ctx.createLinearGradient(0, 0, 0, h);
                shade.addColorStop(0, "#4e3b32");
                shade.addColorStop(0.32, "#25262c");
                shade.addColorStop(1, "#30272a");
                ctx.fillStyle = shade;
                ctx.fillRect(0, 0, w, h);
                var backlight = ctx.createLinearGradient(0, 9, 0, 159);
                backlight.addColorStop(0, "#fff2bc");
                backlight.addColorStop(0.59, "#ffe09a");
                backlight.addColorStop(1, "#d9a36a");
                ctx.fillStyle = backlight;
                ctx.fillRect(18, 16, 112, 136);
                ctx.fillStyle = "#70362e";
                ctx.textAlign = "center";
                ctx.font = "700 98px sans-serif";
                ctx.fillText("3", 74, 120);
                ctx.fillStyle = "#ffe4a9";
                ctx.font = '700 99px "Yu Gothic", Meiryo, sans-serif';
                ctx.fillText("\u5915 \u51EA", 423, 109);
                ctx.font = '600 32px "Segoe UI", sans-serif';
                ctx.fillText("Y U N A G I", 423, 148);
                ctx.fillStyle = "#f8d39144";
                ctx.fillRect(147, 9, 600, 3);
            });
            var lineSign = tramMaterial(16777215, { map: lineSignMap, emissive: 16765593, emissiveMap: lineSignMap, emissiveIntensity: 0.73, roughness: 0.36 });
            function surfaceDecal(face, finish, u, y, w, h, depth) {
                var left = u - w / 2, right = u + w / 2, bottom = y - h / 2, top = y + h / 2;
                curvedPatch(finish, function (u2, y2) { return face.point(u2, y2, depth); }, left, right, level(bottom), level(top), Math.max(2, Math.ceil(h / 0.04)), { casts: false, uv: function (u2, y2) { return [(u2 - left) / w, (y2 - bottom) / h]; } });
            }
            function fitSlidingDoors(face, carX) {
                var e_324, _d, e_325, _e, e_326, _f;
                try {
                    for (var _g = __values([-2.19, 2.19]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var door = _h.value;
                        var panel = roundedWindow(door, 6.563, 0.703, 1.263, 0.033);
                        rim(face, panel, rubber, [[4e-3, 17e-4], [0, 33e-4], [-4e-3, 17e-4]]);
                        skinStrip(face, rubber, door - 45e-4, door + 45e-4, 5.941, 7.185, 26e-4, { casts: false });
                        var _j = __read(face.point(door, 5.883, 0.035).toArray(), 3), x = _j[0], y = _j[1], z = _j[2];
                        casting(rubber, [x, y - 0.024, z], [0.765, 0.077, 0.186], 0.024);
                        casting(pewter, [x, y + 5e-3, z], [0.713, 0.046, 0.177], 0.021);
                        try {
                            for (var _k = (e_325 = void 0, __values([-0.057, -9e-3, 0.04])), _l = _k.next(); !_l.done; _l = _k.next()) {
                                var slip = _l.value;
                                casting(castSteel, [x, y + 0.027, z + face.side * slip], [0.636, 8e-3, 0.01], 3e-3);
                            }
                        }
                        catch (e_325_1) { e_325 = { error: e_325_1 }; }
                        finally {
                            try {
                                if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                            }
                            finally { if (e_325) throw e_325.error; }
                        }
                        try {
                            for (var _m = (e_326 = void 0, __values([-0.051, 0.051])), _o = _m.next(); !_o.done; _o = _m.next()) {
                                var offset = _o.value;
                                var u = door + offset;
                                var pos = face.point(u, 6.444, 8e-3).toArray();
                                casting(soot, pos, [0.038, 0.106, 0.02], 0.012);
                                casting(polished, face.point(u, 6.444, 0.021).toArray(), [0.015, 0.063, 0.014], 5e-3);
                            }
                        }
                        catch (e_326_1) { e_326 = { error: e_326_1 }; }
                        finally {
                            try {
                                if (_o && !_o.done && (_f = _m.return)) _f.call(_m);
                            }
                            finally { if (e_326) throw e_326.error; }
                        }
                        var grab = door + Math.sign(door) * 0.384;
                        var lower = face.point(grab, 6.317, 0.033).toArray(), upper = face.point(grab, 6.482, 0.033).toArray();
                        link(pewter, 9e-3, lower, upper);
                        link(castSteel, 0.01, face.point(grab, 6.329, 4e-3).toArray(), face.point(grab, 6.329, 0.03).toArray());
                        link(castSteel, 0.01, face.point(grab, 6.47, 4e-3).toArray(), face.point(grab, 6.47, 0.03).toArray());
                        surfaceDecal(face, accessStencil, door + 0.248, 6.456, 0.135, 0.076, 5e-3);
                        var hingeX = face.point(door + 0.377, 7.126, 0.012).x;
                        casting(castSteel, [hingeX, 7.126, face.side * (exteriorDimensions(7.126).z + 0.01)], [0.067, 0.048, 0.03], 0.016);
                        pin(amberIndicator, 0.018, 0.017, [hingeX, 7.126, face.side * (exteriorDimensions(7.126).z + 0.028)], [0, 0, face.side]);
                        casting(soot, [carX + face.side * door, 5.81, face.side * 0.74], [0.596, 0.049, 0.143], 0.014);
                    }
                }
                catch (e_324_1) { e_324 = { error: e_324_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_324) throw e_324.error; }
                }
            }
            function makeWheel() {
                return lathe([
                    [0, -0.06],
                    [0.129, -0.06],
                    [0.157, -0.052],
                    [0.173, -0.063],
                    [0.187, -0.07],
                    [0.199, -0.061],
                    [0.202, -0.047],
                    [0.185, -0.027],
                    [0.178, 0.018],
                    [0.176, 0.055],
                    [0.17, 0.066],
                    [0.146, 0.075],
                    [0.128, 0.063],
                    [0.107, 0.036],
                    [0.08, 0.034],
                    [0, 0.034]
                ], 52);
            }
            var wheel = makeWheel();
            var rollingSteel = tramMaterial(9538437, {
                metalness: 0.51,
                roughness: 0.43,
                map: makeTexture(256, 64, function (ctx, w, h) {
                    var band = ctx.createLinearGradient(0, 0, 0, h);
                    band.addColorStop(0, "#716466");
                    band.addColorStop(0.28, "#bab3a8");
                    band.addColorStop(0.51, "#f3e6d2");
                    band.addColorStop(0.73, "#a6a49b");
                    band.addColorStop(1, "#776f63");
                    ctx.fillStyle = band;
                    ctx.fillRect(0, 0, w, h);
                    ctx.fillStyle = "#e3c092";
                    ctx.fillRect(36, 39, 7, 13);
                    ctx.fillStyle = "#4d4a3d6b";
                    ctx.fillRect(123, 28, 26, 16);
                    ctx.fillRect(199, 35, 13, 11);
                })
            });
            var wheelMounts = [], wiperMounts = [], fanMounts = [];
            var wheelRadius = 0.181;
            var bearing = lathe([
                [0, -0.032],
                [0.072, -0.032],
                [0.082, -0.021],
                [0.082, 0.014],
                [0.07, 0.024],
                [0.067, 0.036],
                [0.051, 0.045],
                [0.04, 0.046],
                [0, 0.046]
            ], 36);
            var coil = (function () {
                var path = Array.from({ length: 57 }, function (_, i) {
                    var t = i / 56, theta = t * 4.5 * 2 * Math.PI;
                    return vec(0.037 * Math.cos(theta), -0.062 + 0.124 * t, 0.037 * Math.sin(theta));
                });
                return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path), 56, 73e-4, 8, false);
            })();
            function fitTruck(x) {
                var e_327, _d, e_328, _e;
                casting(castSteel, [x, 5.764, 0], [0.79, 0.131, 1.12], 0.042, 0, true);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        var z = side * 0.615;
                        casting(castSteel, [x, 5.676, z], [0.701, 0.112, 0.16], 0.039, 0, true);
                        casting(soot, [x, 5.639, z], [0.548, 0.089, 0.114], 0.025);
                        casting(pewter, [x, 5.621, z + side * 0.071], [0.213, 0.041, 0.036], 0.01);
                        try {
                            for (var _h = (e_328 = void 0, __values([-0.242, 0.242])), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var dx = _j.value;
                                var at = x + dx;
                                wheelMounts.push({
                                    at: vec(at, 5.59, side * 0.506),
                                    rotation: new THREE.Quaternion().setFromUnitVectors(unitY, vec(0, 0, side))
                                });
                                axial(castSteel, bearing, [at, 5.615, z + side * 0.012], [0, 0, side]);
                                pin(pewter, 0.034, 0.013, [at, 5.615, z + side * 0.063], [0, 0, side]);
                                for (var i = 0; i < 6; i++) {
                                    var theta = i * Math.PI / 3;
                                    pin(pewter, 9e-3, 8e-3, [at + 0.049 * Math.cos(theta), 5.615 + 0.049 * Math.sin(theta), z + side * 0.054], [0, 0, side], boltHead);
                                }
                                var springX = at - dx * 0.28;
                                pin(soot, 0.045, 0.153, [springX, 5.722, z], [0, 1, 0]);
                                addHardware(pewter, coil, [springX, 5.721, z]);
                                pin(castSteel, 0.055, 0.022, [springX, 5.793, z], [0, 1, 0]);
                                pin(castSteel, 0.054, 0.019, [springX, 5.652, z], [0, 1, 0]);
                            }
                        }
                        catch (e_328_1) { e_328 = { error: e_328_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                            }
                            finally { if (e_328) throw e_328.error; }
                        }
                        link(tire, 0.015, [x - 0.234, 5.631, z + side * 0.065], [x + 0.265, 5.667, z + side * 0.078]);
                        casting(soot, [x + 0.097, 5.646, z + side * 0.058], [0.072, 0.078, 0.054], 0.018);
                    }
                }
                catch (e_327_1) { e_327 = { error: e_327_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_327) throw e_327.error; }
                }
            }
            function fitUnderbody(x) {
                var e_329, _d, e_330, _e, e_331, _f;
                casting(soot, [x, 5.793, 0], [5.55, 0.222, 1.203], 0.081, 0, true);
                try {
                    for (var _g = __values([-1.67, 1.67]), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var bogie = _h.value;
                        fitTruck(x + bogie);
                    }
                }
                catch (e_329_1) { e_329 = { error: e_329_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                    }
                    finally { if (e_329) throw e_329.error; }
                }
                try {
                    for (var _j = __values([-1, 1]), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var side = _k.value;
                        var z = side * 0.49;
                        casting(castSteel, [x - 0.235, 5.698, z], [0.943, 0.183, 0.306], 0.045);
                        casting(pewter, [x - 0.235, 5.698, z + side * 0.149], [0.801, 0.123, 0.035], 0.017);
                        for (var l = 0; l < 6; l++) {
                            casting(soot, [x - 0.228, 5.651 + l * 0.018, z + side * 0.172], [0.752, 9e-3, 0.015], 3e-3);
                        }
                        pin(castSteel, 0.094, 0.582, [x + 0.673, 5.695, z], [1, 0, 0]);
                        try {
                            for (var _l = (e_331 = void 0, __values([-0.229, 0.229])), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var dx = _m.value;
                                pin(pewter, 0.102, 0.019, [x + 0.673 + dx, 5.695, z], [1, 0, 0]);
                            }
                        }
                        catch (e_331_1) { e_331 = { error: e_331_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                            }
                            finally { if (e_331) throw e_331.error; }
                        }
                        flex(soot, [[x - 0.78, 5.72, z], [x - 0.95, 5.64, z], [x - 1.09, 5.65, z], [x - 1.23, 5.72, z]], 0.011, 16);
                    }
                }
                catch (e_330_1) { e_330 = { error: e_330_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_e = _j.return)) _e.call(_j);
                    }
                    finally { if (e_330) throw e_330.error; }
                }
            }
            var instrumentFace = tramMaterial(16777215, {
                map: makeTexture(256, 128, function (ctx, w, h) {
                    var e_332, _d;
                    ctx.fillStyle = "#263635";
                    ctx.fillRect(0, 0, w, h);
                    try {
                        for (var _e = __values([[65, 40], [147, 31]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var _g = __read(_f.value, 2), x = _g[0], r = _g[1];
                            ctx.fillStyle = "#c8ba96";
                            ctx.beginPath();
                            ctx.arc(x, 56, r, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = "#262d2e";
                            ctx.beginPath();
                            ctx.arc(x, 56, r - 4, 0, Math.PI * 2);
                            ctx.fill();
                            for (var i = 0; i < 11; i++) {
                                var a = (0.7 + i * 0.163) * Math.PI;
                                ctx.strokeStyle = "#e9dcb5";
                                ctx.lineWidth = i % 5 === 0 ? 3 : 1.4;
                                ctx.beginPath();
                                ctx.moveTo(x + (r - 7) * Math.cos(a), 56 + (r - 7) * Math.sin(a));
                                ctx.lineTo(x + (r - 13) * Math.cos(a), 56 + (r - 13) * Math.sin(a));
                                ctx.stroke();
                            }
                            ctx.strokeStyle = "#de865a";
                            ctx.lineWidth = 2.2;
                            ctx.beginPath();
                            ctx.moveTo(x, 56);
                            ctx.lineTo(x - r * 0.29, 56 - r * 0.54);
                            ctx.stroke();
                        }
                    }
                    catch (e_332_1) { e_332 = { error: e_332_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                        }
                        finally { if (e_332) throw e_332.error; }
                    }
                    ctx.fillStyle = "#e3b87c";
                    ctx.font = "700 12px sans-serif";
                    ctx.fillText("600  \xB7  \u904B\u8EE2\u53F0", 29, 112);
                    ctx.fillStyle = "#dba458";
                    ctx.fillRect(196, 33, 24, 10);
                    ctx.fillStyle = "#9bb5a6";
                    ctx.fillRect(196, 57, 24, 10);
                }),
                emissive: 15053936,
                emissiveIntensity: 0.36,
                roughness: 0.55
            });
            instrumentFace.emissiveMap = instrumentFace.map;
            var instrumentCard = new THREE.PlaneGeometry();
            var flatInstrument = new THREE.Quaternion().setFromAxisAngle(vec(1, 0, 0), -Math.PI / 2);
            var uprightPartition = new THREE.Quaternion().setFromAxisAngle(unitY, Math.PI / 2);
            function fitSaloon(x, cab) {
                var e_333, _d, e_334, _e, e_335, _f, e_336, _g, e_337, _h, e_338, _j, e_339, _k, e_340, _l, e_341, _m, e_342, _o, e_343, _p, e_344, _q;
                casting(cabinWood, [x, 6.341, 0], [5.64, 0.067, 1.495], 0.022);
                casting(cabinWall, [x, 7.224, 0], [5.52, 0.065, 1.205], 0.026);
                var partition = x + cab * 1.86;
                casting(cabinWood, [partition, 6.54, 0], [0.076, 0.351, 1.393], 0.024);
                try {
                    for (var _r = __values([-0.602, 0.602]), _s = _r.next(); !_s.done; _s = _r.next()) {
                        var z = _s.value;
                        casting(cabinWall, [partition, 6.973, z], [0.078, 0.545, 0.176], 0.025);
                    }
                }
                catch (e_333_1) { e_333 = { error: e_333_1 }; }
                finally {
                    try {
                        if (_s && !_s.done && (_d = _r.return)) _d.call(_r);
                    }
                    finally { if (e_333) throw e_333.error; }
                }
                try {
                    for (var _t = __values([-0.221, 0.221]), _u = _t.next(); !_u.done; _u = _t.next()) {
                        var z = _u.value;
                        casting(cabinWood, [partition, 6.899, z], [0.074, 0.488, 0.041], 0.011);
                    }
                }
                catch (e_334_1) { e_334 = { error: e_334_1 }; }
                finally {
                    try {
                        if (_u && !_u.done && (_e = _t.return)) _e.call(_t);
                    }
                    finally { if (e_334) throw e_334.error; }
                }
                casting(cabinWall, [partition, 7.174, 0], [0.081, 0.137, 1.39], 0.024);
                casting(cabinMetal, [partition - cab * 0.048, 6.824, 0], [0.023, 0.019, 1.315], 7e-3);
                try {
                    for (var _v = __values([-0.372, 0, 0.372]), _w = _v.next(); !_w.done; _w = _v.next()) {
                        var z = _w.value;
                        addHardware(partitionGlass, instrumentCard, [partition + cab * 0.011, 6.909, z], uprightPartition, vec(z === 0 ? 0.409 : 0.31, 0.385, 1));
                    }
                }
                catch (e_335_1) { e_335 = { error: e_335_1 }; }
                finally {
                    try {
                        if (_w && !_w.done && (_f = _v.return)) _f.call(_v);
                    }
                    finally { if (e_335) throw e_335.error; }
                }
                casting(cabinWood, [x - cab * 2.56, 6.785, 0], [0.098, 0.797, 0.874], 0.028);
                try {
                    for (var _x = __values([-1, 1]), _y = _x.next(); !_y.done; _y = _x.next()) {
                        var side = _y.value;
                        var z = side * 0.562;
                        casting(cabinWall, [x - cab * 0.075, 6.486, side * 0.745], [4.85, 0.239, 0.102], 0.02);
                        casting(cabinWood, [x - cab * 0.065, 6.579, side * 0.737], [4.79, 0.032, 0.082], 9e-3);
                        casting(cabinMetal, [x - cab * 1.99, 6.385, side * 0.523], [0.516, 0.014, 0.312], 8e-3);
                        try {
                            for (var _z = (e_337 = void 0, __values([-0.98, 0.93])), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                                var position = _0.value;
                                casting(cabinWood, [x + position, 6.464, z], [1.684, 0.198, 0.333], 0.041);
                                casting(upholstery, [x + position, 6.57, z - side * 0.014], [1.724, 0.09, 0.34], 0.036);
                                casting(upholstery, [x + position, 6.686, z + side * 0.113], [1.738, 0.238, 0.105], 0.042);
                                casting(upholsteryEdge, [x + position, 6.763, z + side * 0.088], [1.685, 0.031, 0.059], 0.013);
                                try {
                                    for (var _1 = (e_338 = void 0, __values([-0.561, 0, 0.561])), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                                        var offset = _2.value;
                                        casting(upholsteryEdge, [x + position + offset, 6.688, z + side * 0.057], [6e-3, 0.168, 9e-3], 2e-3);
                                    }
                                }
                                catch (e_338_1) { e_338 = { error: e_338_1 }; }
                                finally {
                                    try {
                                        if (_2 && !_2.done && (_j = _1.return)) _j.call(_1);
                                    }
                                    finally { if (e_338) throw e_338.error; }
                                }
                                try {
                                    for (var _3 = (e_339 = void 0, __values([-1, 1])), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                                        var end = _4.value;
                                        link(cabinMetal, 0.013, [x + position + end * 0.881, 6.543, z - side * 0.097], [x + position + end * 0.881, 6.704, z - side * 0.097]);
                                        link(cabinMetal, 0.013, [x + position + end * 0.881, 6.704, z - side * 0.097], [x + position + end * 0.881, 6.737, z + side * 0.087]);
                                    }
                                }
                                catch (e_339_1) { e_339 = { error: e_339_1 }; }
                                finally {
                                    try {
                                        if (_4 && !_4.done && (_k = _3.return)) _k.call(_3);
                                    }
                                    finally { if (e_339) throw e_339.error; }
                                }
                            }
                        }
                        catch (e_337_1) { e_337 = { error: e_337_1 }; }
                        finally {
                            try {
                                if (_0 && !_0.done && (_h = _z.return)) _h.call(_z);
                            }
                            finally { if (e_337) throw e_337.error; }
                        }
                        casting(cabinWall, [x, 7.136, side * 0.494], [3.83, 0.068, 0.242], 0.028);
                        try {
                            for (var _5 = (e_340 = void 0, __values([-1.12, 0, 1.12])), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                                var dx = _6.value;
                                casting(cabinMetal, [x + dx, 7.118, side * 0.44], [0.97, 0.04, 0.13], 0.014);
                                casting(warmLight, [x + dx, 7.092, side * 0.44], [0.878, 0.024, 0.092], 0.01);
                            }
                        }
                        catch (e_340_1) { e_340 = { error: e_340_1 }; }
                        finally {
                            try {
                                if (_6 && !_6.done && (_l = _5.return)) _l.call(_5);
                            }
                            finally { if (e_340) throw e_340.error; }
                        }
                        link(cabinMetal, 0.011, [x - 1.8, 7.017, side * 0.33], [x + 1.8, 7.017, side * 0.33]);
                        try {
                            for (var _7 = (e_341 = void 0, __values([-1.66, 0.02, 1.66])), _8 = _7.next(); !_8.done; _8 = _7.next()) {
                                var dx = _8.value;
                                link(cabinMetal, 0.013, [x + dx, 6.387, side * 0.309], [x + dx, 7.162, side * 0.309]);
                            }
                        }
                        catch (e_341_1) { e_341 = { error: e_341_1 }; }
                        finally {
                            try {
                                if (_8 && !_8.done && (_m = _7.return)) _m.call(_7);
                            }
                            finally { if (e_341) throw e_341.error; }
                        }
                        try {
                            for (var _9 = (e_342 = void 0, __values([-1.37, -0.77, -0.17, 0.47, 1.08, 1.53])), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                                var dx = _10.value;
                                var z2 = side * 0.33;
                                flex(cabinMetal, [
                                    [x + dx - 0.032, 7.008, z2],
                                    [x + dx + 0.031, 7.008, z2],
                                    [x + dx + 0.039, 6.93, z2],
                                    [x + dx, 6.905, z2],
                                    [x + dx - 0.042, 6.93, z2],
                                    [x + dx - 0.032, 7.008, z2]
                                ], 7e-3, 18);
                            }
                        }
                        catch (e_342_1) { e_342 = { error: e_342_1 }; }
                        finally {
                            try {
                                if (_10 && !_10.done && (_o = _9.return)) _o.call(_9);
                            }
                            finally { if (e_342) throw e_342.error; }
                        }
                    }
                }
                catch (e_336_1) { e_336 = { error: e_336_1 }; }
                finally {
                    try {
                        if (_y && !_y.done && (_g = _x.return)) _g.call(_x);
                    }
                    finally { if (e_336) throw e_336.error; }
                }
                casting(consoleMetal, [x + cab * 2.52, 6.521, 0], [0.462, 0.287, 0.897], 0.066);
                casting(consoleMetal, [x + cab * 2.55, 6.662, 0], [0.407, 0.052, 0.84], 0.021);
                casting(cabinMetal, [x + cab * 2.692, 6.703, 0.072], [0.161, 0.052, 0.492], 0.018);
                addHardware(instrumentFace, instrumentCard, [x + cab * 2.68, 6.731, 0.074], flatInstrument, vec(0.155, 0.449, 1));
                try {
                    for (var _11 = __values([-0.206, 0.086]), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                        var z = _12.value;
                        pin(cabinMetal, 0.043, 0.022, [x + cab * 2.604, 6.694, z], [0, 1, 0]);
                        pin(amberIndicator, 0.011, 0.014, [x + cab * 2.612, 6.708, z], [0, 1, 0]);
                    }
                }
                catch (e_343_1) { e_343 = { error: e_343_1 }; }
                finally {
                    try {
                        if (_12 && !_12.done && (_p = _11.return)) _p.call(_11);
                    }
                    finally { if (e_343) throw e_343.error; }
                }
                try {
                    for (var _13 = __values([0.242, 0.287, 0.332]), _14 = _13.next(); !_14.done; _14 = _13.next()) {
                        var z = _14.value;
                        pin(cabinMetal, 9e-3, 0.02, [x + cab * 2.476, 6.696, z], [0, 1, 0]);
                    }
                }
                catch (e_344_1) { e_344 = { error: e_344_1 }; }
                finally {
                    try {
                        if (_14 && !_14.done && (_q = _13.return)) _q.call(_13);
                    }
                    finally { if (e_344) throw e_344.error; }
                }
                link(cabinMetal, 0.014, [x + cab * 2.43, 6.678, -cab * 0.237], [x + cab * 2.42, 6.756, -cab * 0.237]);
                capsule(consoleMetal, [x + cab * 2.42, 6.76, -cab * 0.237], [0.033, 0.018, 0.02]);
                casting(cabinWall, [x + cab * 2.512, 6.698, -0.346], [0.123, 0.012, 0.146], 3e-3);
                casting(upholstery, [x + cab * 2.141, 6.527, -cab * 0.231], [0.273, 0.085, 0.286], 0.035);
                casting(upholstery, [x + cab * 2.006, 6.635, -cab * 0.231], [0.081, 0.238, 0.285], 0.032);
                casting(warmLight, [x + cab * 2.45, 7.116, 0], [0.288, 0.024, 0.091], 0.011);
            }
            function fitDriver(x) {
                var e_345, _d, e_346, _e;
                var coat = interior(4871005, { roughness: 0.82 });
                var face = interior(13608583);
                var seatX = x + 2.24, z = -0.231;
                capsule(coat, [seatX, 6.693, z], [0.108, 0.164, 0.119]);
                capsule(face, [seatX + 0.036, 6.904, z], [0.068, 0.084, 0.067]);
                capsule(face, [seatX + 0.098, 6.891, z], [0.018, 0.022, 0.021]);
                capsule(coat, [seatX + 0.034, 6.977, z], [0.077, 0.039, 0.074]);
                capsule(gilt, [seatX + 0.088, 6.981, z], [0.018, 0.01, 0.019]);
                capsule(soot, [seatX + 0.09, 6.952, z], [0.057, 0.012, 0.071]);
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        capsule(consoleMetal, [seatX + 0.092, 6.92, z + side * 0.025], [4e-3, 4e-3, 8e-3]);
                        capsule(cabinMetal, [seatX + 0.083, 6.777, z + side * 0.055], [5e-3, 7e-3, 7e-3]);
                    }
                }
                catch (e_345_1) { e_345 = { error: e_345_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_345) throw e_345.error; }
                }
                try {
                    for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var side = _j.value;
                        var a = [seatX + 0.02, 6.773, z + side * 0.106], b = [seatX + 0.122, 6.685, z + side * 0.134];
                        var c = [seatX + 0.264, 6.698, z + side * 0.093];
                        link(coat, 0.035, a, b);
                        link(coat, 0.03, b, c);
                        capsule(face, c, [0.032, 0.023, 0.025]);
                    }
                }
                catch (e_346_1) { e_346 = { error: e_346_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                    }
                    finally { if (e_346) throw e_346.error; }
                }
            }
            var riderSkin = interior(12884346), riderHair = interior(3748663);
            var riderRust = interior(10709840), riderBlue = interior(6448512);
            function fitRider(x, side, coat, reading) {
                var e_347, _d;
                var z = side * 0.531;
                capsule(coat, [x, 6.761, z], [0.105, 0.146, 0.085]);
                capsule(riderSkin, [x + 0.011, 6.939, z - side * 0.042], [0.066, 0.077, 0.064]);
                capsule(riderHair, [x + 9e-3, 6.972, z + side * 3e-3], [0.071, 0.065, 0.068]);
                try {
                    for (var _e = __values([-0.052, 0.052]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var dx = _f.value;
                        var knee = [x + dx, 6.562, z - side * 0.162];
                        link(coat, 0.048, [x + dx, 6.578, z], knee);
                        link(consoleMetal, 0.032, knee, [x + dx, 6.413, z - side * 0.199]);
                        var hand = [x + dx * 0.9, reading ? 6.734 : 6.604, z - side * 0.178];
                        link(coat, 0.038, [x + dx * 1.71, 6.789, z - side * 0.012], [x + dx * 1.54, 6.665, z - side * 0.112]);
                        link(coat, 0.029, [x + dx * 1.54, 6.665, z - side * 0.112], hand);
                        capsule(riderSkin, hand, [0.024, 0.021, 0.024]);
                    }
                }
                catch (e_347_1) { e_347 = { error: e_347_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_347) throw e_347.error; }
                }
                if (reading)
                    casting(cabinWall, [x, 6.743, z - side * 0.18], [0.16, 0.014, 0.116], 5e-3);
            }
            var lensMap = makeTexture(192, 192, function (ctx, w, h) {
                var pixels = ctx.createImageData(w, h);
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var u = 2 * x / (w - 1) - 1, v = 2 * y / (h - 1) - 1, r = Math.hypot(u, v);
                        var rib = 0.5 + 0.5 * Math.cos(v * 11 * Math.PI + 0.7 * u * u);
                        var value = Math.max(0, Math.min(1, 0.94 - 0.47 * __pow(r, 2) + 0.22 * rib + 0.063 * Math.cos(16 * r)));
                        var at = 4 * (y * w + x);
                        pixels.data[at] = 255 * (0.54 + 0.46 * value);
                        pixels.data[at + 1] = 255 * (0.39 + 0.61 * value);
                        pixels.data[at + 2] = 255 * (0.21 + 0.75 * value);
                        pixels.data[at + 3] = 255;
                    }
                }
                ctx.putImageData(pixels, 0, 0);
            });
            var headlamp = tramMaterial(16769969, { map: lensMap, emissive: 16761196, emissiveMap: lensMap, emissiveIntensity: 1.88, roughness: 0.34 });
            var tailLamp = tramMaterial(14835782, { map: lensMap, emissive: 15222055, emissiveMap: lensMap, emissiveIntensity: 0.78, roughness: 0.38 });
            var lampCup = lathe([[0.051, -0.032], [0.123, -0.026], [0.124, 6e-3], [0.12, 0.022], [0.111, 0.035], [0.097, 0.042], [0.091, 0.038]], 56);
            var lampBezel = lathe([
                [0.086, 0.021],
                [0.093, 0.028],
                [0.1, 0.038],
                [0.106, 0.043],
                [0.111, 0.05],
                [0.11, 0.056],
                [0.106, 0.06],
                [0.101, 0.061],
                [0.097, 0.058],
                [0.093, 0.053],
                [0.088, 0.046]
            ], 64);
            function buildLens() {
                var positions = [], uv = [], indices = [];
                var spokes = 72, rings = 16, radius = 0.094;
                for (var ring = 0; ring <= rings; ring++) {
                    var r = radius * (1 - ring / rings);
                    for (var spoke = 0; spoke <= spokes; spoke++) {
                        var theta = 2 * Math.PI * spoke / spokes;
                        var x = r * Math.sin(theta), z = r * Math.cos(theta);
                        var y = 0.048 + 0.03 * (1 - __pow(r / radius, 2)) + 65e-5 * Math.cos(350 * z) * __pow(r / radius, 2);
                        positions.push(x, y, z);
                        uv.push(0.5 + x / (2 * radius), 0.5 + z / (2 * radius));
                        if (ring === rings || spoke === spokes)
                            continue;
                        var a = ring * (spokes + 1) + spoke, b = a + 1, c = a + spokes + 1, d = c + 1;
                        indices.push(a, b, c, b, d, c);
                    }
                }
                var geometry = new THREE.BufferGeometry();
                geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
                geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();
                var normals = geometry.attributes.normal;
                for (var i = 0; i <= spokes; i++)
                    normals.setXYZ(rings * (spokes + 1) + i, 0, 1, 0);
                return geometry;
            }
            var lens = buildLens();
            var lampD = exteriorDimensions(lampY);
            var lampRatio = lampOffset / (lampD.z - lampD.cz);
            var lampAt = lampD.x + lampD.bow * __pow(1 - lampRatio * lampRatio, 2) + 0.021;
            var lampX = spacing / 2 + lampAt + 0.079;
            function fitCabFront(face, x, cab, serial) {
                var e_348, _d, e_349, _e, e_350, _f, e_351, _g;
                var destination = roundedWindow(0, 7.18, 0.625, 0.133, 0.03);
                rim(face, destination, rubber, [[0.018, 3e-3], [0.015, 0.016], [0, 0.025], [-6e-3, 0.018]]);
                rim(face, destination, pewter, [[5e-3, 0.019], [0, 0.027], [-7e-3, 0.026], [-9e-3, 0.019]]);
                surfaceDecal(face, lineSign, 0, 7.18, 0.611, 0.121, 0.018);
                var plate = roundedWindow(0, 6.154, 0.359, 0.124, 0.022);
                var _h = __read(face.point(0, plate.y, 8e-3).toArray(), 3), plateX = _h[0], plateY = _h[1], plateZ = _h[2];
                casting(skirt, [plateX, plateY, plateZ], [0.032, 0.124, 0.359], 0.018);
                rim(face, plate, gilt, [[0, 0.012], [-4e-3, 0.02], [-8e-3, 0.018]]);
                surfaceDecal(face, serial, 0, 6.157, 0.231, 0.103, 0.026);
                try {
                    for (var _j = __values([-lampOffset, lampOffset]), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var z = _k.value;
                        var at = [x + cab * lampAt, lampY, z];
                        axial(castSteel, lampCup, at, [cab, 0, 0]);
                        axial(polished, lampBezel, at, [cab, 0, 0]);
                        axial(cab > 0 ? headlamp : tailLamp, lens, at, [cab, 0, 0]);
                        try {
                            for (var _l = (e_349 = void 0, __values([-1, 1])), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var side = _m.value;
                                pin(gilt, 7e-3, 0.01, [at[0] + cab * 0.038, lampY, z + side * 0.106], [cab, 0, 0], boltHead);
                            }
                        }
                        catch (e_349_1) { e_349 = { error: e_349_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_e = _l.return)) _e.call(_l);
                            }
                            finally { if (e_349) throw e_349.error; }
                        }
                    }
                }
                catch (e_348_1) { e_348 = { error: e_348_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                    }
                    finally { if (e_348) throw e_348.error; }
                }
                try {
                    for (var _o = __values([-0.217, 0.217]), _p = _o.next(); !_p.done; _p = _o.next()) {
                        var pane = _p.value;
                        var base = face.point(pane - 0.103, 6.596, 0.015);
                        pin(rubber, 0.02, 0.015, base.toArray(), [cab, 0, 0]);
                        pin(pewter, 0.01, 0.021, base.clone().add(vec(cab * 0.01, 0, 0)).toArray(), [cab, 0, 0], boltHead);
                        wiperMounts.push({
                            at: base.clone().add(vec(cab * 0.012, 0, 0)),
                            cab: cab,
                            rotation: new THREE.Quaternion().setFromAxisAngle(unitY, cab > 0 ? 0 : Math.PI)
                        });
                    }
                }
                catch (e_350_1) { e_350 = { error: e_350_1 }; }
                finally {
                    try {
                        if (_p && !_p.done && (_f = _o.return)) _f.call(_o);
                    }
                    finally { if (e_350) throw e_350.error; }
                }
                var bumper = x + cab * 2.925;
                casting(castSteel, [bumper, 5.764, 0], [0.16, 0.114, 1.221], 0.046, 0, true);
                try {
                    for (var _q = __values([-0.386, 0.386]), _r = _q.next(); !_r.done; _r = _q.next()) {
                        var z = _r.value;
                        casting(pewter, [bumper + cab * 0.069, 5.765, z], [0.042, 0.073, 0.137], 0.023);
                        pin(soot, 0.013, 0.022, [bumper + cab * 0.093, 5.765, z], [cab, 0, 0], boltHead);
                    }
                }
                catch (e_351_1) { e_351 = { error: e_351_1 }; }
                finally {
                    try {
                        if (_r && !_r.done && (_g = _q.return)) _g.call(_q);
                    }
                    finally { if (e_351) throw e_351.error; }
                }
                casting(soot, [bumper + cab * 0.106, 5.692, 0], [0.199, 0.114, 0.22], 0.031);
                casting(castSteel, [bumper + cab * 0.171, 5.695, 0], [0.095, 0.142, 0.274], 0.028);
                casting(rubber, [bumper + cab * 0.222, 5.692, 0], [0.032, 0.08, 0.166], 0.011);
                flex(soot, [
                    [bumper, 5.724, 0.226],
                    [bumper + cab * 0.149, 5.652, 0.191],
                    [bumper + cab * 0.196, 5.622, 0.152],
                    [bumper + cab * 0.177, 5.698, 0.141]
                ], 0.014, 21);
            }
            var fanRings = [0.061, 0.106, 0.15].map(function (radius) { return new THREE.TorusGeometry(radius, 45e-4, 8, 42); });
            var flatRing = new THREE.Quaternion().setFromAxisAngle(vec(1, 0, 0), -Math.PI / 2);
            function fitCoolingUnit(x, double) {
                var e_352, _d, e_353, _e, e_354, _f, e_355, _g, e_356, _h;
                var width = double ? 1.058 : 0.691;
                casting(rubber, [x, 7.564, 0], [width + 0.02, 0.074, 0.64], 0.031);
                casting(ventHood, [x, 7.63, 0], [width, 0.132, 0.624], 0.06, 0, true);
                try {
                    for (var _j = __values(double ? [-0.241, 0.241] : [0]), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var dx = _k.value;
                        var fanX = x + dx;
                        pin(castSteel, 0.178, 0.034, [fanX, 7.688, 0], [0, 1, 0]);
                        pin(soot, 0.154, 0.017, [fanX, 7.696, 0], [0, 1, 0]);
                        fanMounts.push(vec(fanX, 7.705, 0));
                        pin(pewter, 0.043, 0.012, [fanX, 7.714, 0], [0, 1, 0]);
                        try {
                            for (var fanRings_1 = (e_353 = void 0, __values(fanRings)), fanRings_1_1 = fanRings_1.next(); !fanRings_1_1.done; fanRings_1_1 = fanRings_1.next()) {
                                var geometry = fanRings_1_1.value;
                                addHardware(pewter, geometry, [fanX, 7.722, 0], flatRing);
                            }
                        }
                        catch (e_353_1) { e_353 = { error: e_353_1 }; }
                        finally {
                            try {
                                if (fanRings_1_1 && !fanRings_1_1.done && (_e = fanRings_1.return)) _e.call(fanRings_1);
                            }
                            finally { if (e_353) throw e_353.error; }
                        }
                        try {
                            for (var _l = (e_354 = void 0, __values([-1, 1])), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var direction = _m.value;
                                casting(castSteel, [fanX, 7.719, direction * 0.101], [0.011, 0.011, 0.17], 4e-3);
                                casting(castSteel, [fanX + direction * 0.101, 7.719, 0], [0.17, 0.011, 0.011], 4e-3);
                            }
                        }
                        catch (e_354_1) { e_354 = { error: e_354_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_f = _l.return)) _f.call(_l);
                            }
                            finally { if (e_354) throw e_354.error; }
                        }
                    }
                }
                catch (e_352_1) { e_352 = { error: e_352_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                    }
                    finally { if (e_352) throw e_352.error; }
                }
                try {
                    for (var _o = __values([-1, 1]), _p = _o.next(); !_p.done; _p = _o.next()) {
                        var side = _p.value;
                        try {
                            for (var _q = (e_356 = void 0, __values([-width * 0.37, width * 0.37])), _r = _q.next(); !_r.done; _r = _q.next()) {
                                var dx = _r.value;
                                pin(pewter, 0.012, 0.012, [x + dx, 7.696, side * 0.245], [0, 1, 0], boltHead);
                            }
                        }
                        catch (e_356_1) { e_356 = { error: e_356_1 }; }
                        finally {
                            try {
                                if (_r && !_r.done && (_h = _q.return)) _h.call(_q);
                            }
                            finally { if (e_356) throw e_356.error; }
                        }
                    }
                }
                catch (e_355_1) { e_355 = { error: e_355_1 }; }
                finally {
                    try {
                        if (_p && !_p.done && (_g = _o.return)) _g.call(_o);
                    }
                    finally { if (e_355) throw e_355.error; }
                }
            }
            function fitRoofGear(x, cab) {
                var e_357, _d, e_358, _e;
                fitCoolingUnit(x + cab * 1.48, true);
                var grilleX = x - cab * 1.51;
                casting(rubber, [grilleX, 7.567, 0], [0.727, 0.065, 0.536], 0.031);
                casting(ventHood, [grilleX, 7.615, 0], [0.709, 0.103, 0.516], 0.049, 0, true);
                casting(soot, [grilleX, 7.663, 0], [0.565, 0.022, 0.381], 0.01);
                for (var i = -4; i <= 4; i++) {
                    casting(pewter, [grilleX, 7.678, i * 0.039], [0.526, 0.013, 0.018], 6e-3);
                }
                try {
                    for (var _f = __values([-1, 1]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var side = _g.value;
                        flex(castSteel, [
                            [x - 1.68, 7.616, side * 0.29],
                            [x - 1.37, 7.565, side * 0.419],
                            [x + 0.09, 7.56, side * 0.416],
                            [x + 1.28, 7.567, side * 0.408],
                            [x + 1.53, 7.612, side * 0.282]
                        ], 0.013, 40);
                        try {
                            for (var _h = (e_358 = void 0, __values([-1.2, -0.44, 0.35, 1.09])), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var dx = _j.value;
                                casting(pewter, [x + dx, 7.559, side * 0.421], [0.037, 0.028, 0.065], 0.011);
                            }
                        }
                        catch (e_358_1) { e_358 = { error: e_358_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                            }
                            finally { if (e_358) throw e_358.error; }
                        }
                    }
                }
                catch (e_357_1) { e_357 = { error: e_357_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_357) throw e_357.error; }
                }
                if (cab < 0) {
                    casting(ventHood, [x + 0.047, 7.602, 0], [0.374, 0.073, 0.359], 0.035, 0, true);
                    casting(castSteel, [x + 0.047, 7.645, 0], [0.277, 0.023, 0.258], 0.011);
                }
            }
            function fitPantograph(x) {
                var e_359, _d, e_360, _e, e_361, _f, e_362, _g;
                casting(castSteel, [x, 7.661, 0], [0.937, 0.04, 0.518], 0.019, 0, true);
                try {
                    for (var _h = __values([-1, 1]), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var side = _j.value;
                        var z = side * 0.155;
                        try {
                            for (var _k = (e_360 = void 0, __values([-0.322, 0.332])), _l = _k.next(); !_l.done; _l = _k.next()) {
                                var offset = _l.value;
                                pin(castSteel, 0.043, 0.066, [x + offset, 7.617, z], [0, 1, 0]);
                                try {
                                    for (var _m = (e_361 = void 0, __values([7.591, 7.613, 7.635])), _o = _m.next(); !_o.done; _o = _m.next()) {
                                        var y = _o.value;
                                        pin(porcelain, 0.058, 0.012, [x + offset, y, z], [0, 1, 0]);
                                    }
                                }
                                catch (e_361_1) { e_361 = { error: e_361_1 }; }
                                finally {
                                    try {
                                        if (_o && !_o.done && (_f = _m.return)) _f.call(_m);
                                    }
                                    finally { if (e_361) throw e_361.error; }
                                }
                            }
                        }
                        catch (e_360_1) { e_360 = { error: e_360_1 }; }
                        finally {
                            try {
                                if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                            }
                            finally { if (e_360) throw e_360.error; }
                        }
                        var base = [x - 0.387, 7.685, z], elbow = [x + 0.239, 7.91, z], shoe = [x - 0.271, 8.092, z * 0.8];
                        link(castSteel, 0.022, base, elbow, true);
                        link(castSteel, 0.019, elbow, shoe, true);
                        link(tire, 0.01, [x + 0.154, 7.692, z], [x + 0.197, 7.89, z]);
                        pin(pewter, 0.035, 0.022, elbow, [0, 0, side], rod2, true);
                        link(castSteel, 0.016, [x - 0.16, 7.725, z], [x + 0.07, 7.803, z]);
                    }
                }
                catch (e_359_1) { e_359 = { error: e_359_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                    }
                    finally { if (e_359) throw e_359.error; }
                }
                pin(pewter, 0.026, 0.374, [x + 0.239, 7.91, 0], [0, 0, 1]);
                pin(gilt, 0.019, 0.343, [x - 0.271, 8.096, 0], [0, 0, 1]);
                casting(gilt, [x - 0.271, 8.112, 0], [0.195, 0.026, 0.555], 0.011, 0, true);
                try {
                    for (var _p = __values([-0.047, 0.047]), _q = _p.next(); !_q.done; _q = _p.next()) {
                        var dx = _q.value;
                        casting(soot, [x - 0.271 + dx, 8.129, 0], [0.039, 0.014, 0.538], 6e-3);
                    }
                }
                catch (e_362_1) { e_362 = { error: e_362_1 }; }
                finally {
                    try {
                        if (_q && !_q.done && (_g = _p.return)) _g.call(_p);
                    }
                    finally { if (e_362) throw e_362.error; }
                }
                flex(castSteel, [
                    [x - 0.27, 8.123, -0.385],
                    [x - 0.27, 8.105, -0.304],
                    [x - 0.27, 8.108, 0],
                    [x - 0.27, 8.105, 0.304],
                    [x - 0.27, 8.123, 0.385]
                ], 0.012, 26);
                flex(gilt, [
                    [x - 0.399, 7.666, -0.191],
                    [x - 0.426, 7.708, -0.268],
                    [x - 0.512, 7.63, -0.336],
                    [x - 0.629, 7.573, -0.369]
                ], 0.013, 18);
            }
            function finishExterior(face, x, cab, serial) {
                var side = face.kind === "side", front = face.kind === "end" && face.end === cab;
                var corner = face.kind === "corner" && face.end === cab;
                var windows = side ? __spreadArray(__spreadArray([], __read([-2.339, -2.041, 2.041, 2.339].map(function (u) { return roundedWindow(u, 6.842, 0.235, 0.53, 0.03); })), false), __read([-1.594, -0.956, -0.319, 0.319, 0.956, 1.594].map(function (u) { return roundedWindow(u, 6.839, 0.546, 0.525, 0.031, true); })), false).sort(function (a, b) { return a.u - b.u; }) : front ? [-0.217, 0.217].map(function (u) { return roundedWindow(u, 6.827, 0.379, 0.513, 0.03); }) : corner ? [roundedWindow(0, 6.831, 0.271, 0.493, 0.025)] : [];
                var paintUv = paintPanel(face, cab, windows, front);
                skinStrip(face, lowerPaint, -face.half, face.half, 5.728, 5.879, 0, { uv: paintUv });
                skinStrip(face, vermilion, -face.half, face.half, 5.879, 6.347, 0, { uv: paintUv });
                skinStrip(face, gilt, -face.half, face.half, 6.316, 6.333, 26e-4, { casts: false });
                skinWithWindows(face, windows, paintUv, cab);
                var roofPitch = face.kind === "corner" ? 0.023 : 0.073;
                skinStrip(face, gilt, -face.half, face.half, roofSpring - 0.019, roofSpring - 5e-3, 7e-3, { casts: false, pitch: roofPitch });
                curvedPatch(eave, face.crown, -face.half, face.half, level(0), level(0.252), 9, { pitch: roofPitch });
                curvedPatch(rubber, face.crown, -face.half, face.half, level(0.252), level(0.363), 6, { pitch: roofPitch });
                curvedPatch(roof, face.crown, -face.half, face.half, level(0.363), level(1), 24, { pitch: roofPitch, normalLimit: 0.9992, uv: function (u, t, p) { return roofUv(x, cab, p); } });
                if (side) {
                    var logo = face.side * cab * 0.61;
                    surfaceDecal(face, fleetInsignia, logo, 6.115, 1.16, 0.359, 33e-4);
                    surfaceDecal(face, serial, -face.side * cab * 1.297, 6.077, 0.399, 0.182, 33e-4);
                    var routeX = face.side * cab * 1.455;
                    var routeBoard = roundedWindow(routeX, 6.236, 0.391, 0.098, 0.017);
                    rim(face, routeBoard, rubber, [[0.012, -2e-3], [8e-3, 0.014], [-4e-3, 0.016]]);
                    surfaceDecal(face, lineSign, routeX, 6.236, 0.378, 0.085, 0.011);
                    var serviceX = -face.side * cab * 0.738;
                    var inspectionCover = roundedWindow(serviceX, 5.998, 0.251, 0.142, 0.019);
                    rim(face, inspectionCover, skirt, [[2e-3, 14e-4], [-3e-3, 32e-4], [-9e-3, 17e-4]]);
                    casting(polished, face.point(serviceX + 0.073, 5.996, 5e-3).toArray(), [0.012, 0.022, 8e-3], 4e-3);
                    fitSlidingDoors(face, x);
                }
                if (front)
                    fitCabFront(face, x, cab, serial);
            }
            try {
                for (var _r = __values([-1, 1]), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var cab = _s.value;
                    var x = cab * spacing / 2;
                    var serial = numberStencil(cab > 0 ? "601" : "602");
                    try {
                        for (var faces_3 = (e_307 = void 0, __values(faces)), faces_3_1 = faces_3.next(); !faces_3_1.done; faces_3_1 = faces_3.next()) {
                            var face = faces_3_1.value;
                            finishExterior(bindFace(face, x), x, cab, serial);
                        }
                    }
                    catch (e_307_1) { e_307 = { error: e_307_1 }; }
                    finally {
                        try {
                            if (faces_3_1 && !faces_3_1.done && (_h = faces_3.return)) _h.call(faces_3);
                        }
                        finally { if (e_307) throw e_307.error; }
                    }
                    fitUnderbody(x);
                    fitSaloon(x, cab);
                    fitRider(x + (cab > 0 ? 0.94 : -0.96), 1, cab > 0 ? riderRust : riderBlue, cab > 0);
                    fitRider(x + (cab > 0 ? -0.74 : 1.19), -1, cab > 0 ? riderBlue : riderRust, cab < 0);
                    fitRoofGear(x, cab);
                    if (cab > 0)
                        fitDriver(x);
                }
            }
            catch (e_306_1) { e_306 = { error: e_306_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_g = _r.return)) _g.call(_r);
                }
                finally { if (e_306) throw e_306.error; }
            }
            fitPantograph(spacing / 2 - 0.205);
            casting(soot, [0, 6.426, 0], [0.262, 1.105, 0.797], 0.113);
            for (var fold = -3; fold <= 3; fold++) {
                casting(fold % 2 === 0 ? rubber : castSteel, [fold * 0.031, 6.432, 0], [0.019, 1.115, 0.862], 0.03);
            }
            casting(castSteel, [0, 6.353, 0], [0.253, 0.046, 0.615], 0.018);
            pin(castSteel, 0.059, 0.287, [0, 5.738, 0], [1, 0, 0]);
            flex(soot, [[-0.145, 5.852, 0.204], [-0.075, 5.712, 0.246], [0.062, 5.708, 0.21], [0.149, 5.842, 0.204]], 0.019, 23);
            try {
                for (var _t = __values(surfaces.values()), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var batch = _u.value;
                    var geometry = new THREE.BufferGeometry();
                    geometry.setAttribute("position", new THREE.Float32BufferAttribute(batch.points, 3));
                    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(batch.uvs, 2));
                    geometry.setIndex(batch.triangles);
                    geometry.computeVertexNormals();
                    var normals = geometry.attributes.normal;
                    for (var n = 0; n < batch.normals.length; n += 3) {
                        var nx = batch.normals[n], ny = batch.normals[n + 1], nz = batch.normals[n + 2];
                        if (nx || ny || nz)
                            normals.setXYZ(n / 3, nx, ny, nz);
                    }
                    var mesh = new THREE.Mesh(geometry, batch.finish);
                    mesh.castShadow = batch.casts;
                    mesh.receiveShadow = true;
                    mesh.renderOrder = batch.order;
                    train2.add(mesh);
                    if (batch.finish === glazing) {
                        var moisture = new THREE.Mesh(geometry, wetGlass);
                        moisture.name = "Rain on the tram panes";
                        moisture.visible = false;
                        moisture.renderOrder = 3;
                        train2.add(moisture);
                        wetWindowMeshes.push(moisture);
                    }
                }
            }
            catch (e_308_1) { e_308 = { error: e_308_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_j = _t.return)) _j.call(_t);
                }
                finally { if (e_308) throw e_308.error; }
            }
            try {
                for (var _v = __values(hardware.values()), _w = _v.next(); !_w.done; _w = _v.next()) {
                    var batch = _w.value;
                    var geometry = mergeGeometries(batch.parts);
                    var mesh = new THREE.Mesh(geometry, batch.finish);
                    mesh.castShadow = batch.casts;
                    mesh.receiveShadow = true;
                    train2.add(mesh);
                    batch.parts.forEach(function (part) { return part.dispose(); });
                }
            }
            catch (e_309_1) { e_309 = { error: e_309_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_k = _v.return)) _k.call(_v);
                }
                finally { if (e_309) throw e_309.error; }
            }
            function motionBatch(name, geometry, finish, capacity, casts) {
                if (casts === void 0) { casts = false; }
                var batch = new THREE.InstancedMesh(geometry, finish, capacity);
                batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                batch.userData.tramMotion = true;
                batch.name = name;
                batch.frustumCulled = false;
                batch.castShadow = casts;
                batch.receiveShadow = true;
                train2.add(batch);
                return batch;
            }
            function wiperTube(points, radius, segments) {
                return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function (p) { return vec.apply(void 0, __spreadArray([], __read(p), false)); })), segments, radius, 10, false);
            }
            var wiperArm = wiperTube([[0, 0, 0], [6e-3, 0, -0.093], [4e-3, 0, -0.204]], 68e-4, 12);
            var wiperBlade = wiperTube([[1e-3, 0, -0.119], [4e-3, 0, -0.202], [1e-3, 0, -0.276]], 79e-4, 12);
            var fanParts = Array.from({ length: 7 }, function (_, i) {
                var angle = i * Math.PI * 2 / 7;
                return filletBox(0.116, 0.016, 0.045, 7e-3).clone().rotateY(-angle + 0.48).translate(0.088 * Math.cos(angle), 0, 0.088 * Math.sin(angle));
            });
            var rotor = mergeGeometries(fanParts);
            fanParts.forEach(function (part) { return part.dispose(); });
            try {
                for (var _x = __values(fillets.values()), _y = _x.next(); !_y.done; _y = _x.next()) {
                    var geometry = _y.value;
                    geometry.dispose();
                }
            }
            catch (e_310_1) { e_310 = { error: e_310_1 }; }
            finally {
                try {
                    if (_y && !_y.done && (_l = _x.return)) _l.call(_x);
                }
                finally { if (e_310) throw e_310.error; }
            }
            var wheels = motionBatch("Rolling wheelsets", wheel, rollingSteel, wheelMounts.length, true);
            var arms = motionBatch("Moving wiper arms", wiperArm, castSteel, wiperMounts.length);
            var blades = motionBatch("Moving wiper blades", wiperBlade, rubber, wiperMounts.length);
            var fans = motionBatch("Turning roof fans", rotor, ventHood, fanMounts.length);
            var spin = new THREE.Quaternion(), axle = new THREE.Quaternion();
            var railAxis = vec(0, 0, 1), hingeAxis = vec(1, 0, 0);
            var lastRotation = NaN, lastAngle = NaN, lastFanTime = NaN;
            function updateTramMotion(seconds, travel) {
                var roll = -travel / wheelRadius;
                if (roll !== lastRotation) {
                    spin.setFromAxisAngle(railAxis, roll);
                    wheelMounts.forEach(function (_d, index) {
                        var at = _d.at, rotation = _d.rotation;
                        axle.multiplyQuaternions(spin, rotation);
                        wheels.setMatrixAt(index, matrix2.compose(at, axle, unit));
                    });
                    wheels.instanceMatrix.needsUpdate = true;
                    lastRotation = roll;
                }
                if (lastFanTime !== seconds) {
                    fanMounts.forEach(function (at, index) {
                        spin.setFromAxisAngle(unitY, seconds * (9.6 + 0.2 * index) + index * 0.77);
                        fans.setMatrixAt(index, matrix2.compose(at, spin, unit));
                    });
                    fans.instanceMatrix.needsUpdate = true;
                    lastFanTime = seconds;
                }
                var wet = windowRain.value;
                var cycle = THREE.MathUtils.euclideanModulo(seconds, 2.34);
                var outward = smooth(cycle, 0.1, 0.73), inward = smooth(cycle, 0.75, 1.38);
                var enabled = smooth(wet, 0.08, 0.64);
                var angle = wiperPark + wiperTravel * outward * (1 - inward) * enabled;
                var clearing = enabled * (1 - 0.9 * smooth(cycle, 1.38, 2.34));
                wiperGlass.value.set(wiperPark + wiperTravel * outward * enabled, clearing);
                if (angle === lastAngle)
                    return;
                wiperMounts.forEach(function (_d, index) {
                    var at = _d.at, rotation = _d.rotation, cab = _d.cab;
                    spin.setFromAxisAngle(hingeAxis, cab > 0 ? angle : wiperPark);
                    axle.multiplyQuaternions(rotation, spin);
                    matrix2.compose(at, axle, unit);
                    arms.setMatrixAt(index, matrix2);
                    blades.setMatrixAt(index, matrix2);
                });
                arms.instanceMatrix.needsUpdate = blades.instanceMatrix.needsUpdate = true;
                lastAngle = angle;
            }
            updateTramMotion(0, 0);
            function setTramFinish(amount) {
                var e_363, _d;
                vermilion.roughness = THREE.MathUtils.lerp(0.59, 0.43, amount);
                cream.roughness = THREE.MathUtils.lerp(0.65, 0.51, amount);
                vermilion.clearcoat = cream.clearcoat = THREE.MathUtils.lerp(0.25, 0.35, amount);
                glazing.roughness = THREE.MathUtils.lerp(0.24, 0.18, amount);
                glazing.clearcoatRoughness = THREE.MathUtils.lerp(0.2, 0.13, amount);
                windowRain.value = amount;
                try {
                    for (var wetWindowMeshes_1 = __values(wetWindowMeshes), wetWindowMeshes_1_1 = wetWindowMeshes_1.next(); !wetWindowMeshes_1_1.done; wetWindowMeshes_1_1 = wetWindowMeshes_1.next()) {
                        var mesh = wetWindowMeshes_1_1.value;
                        mesh.visible = amount > 4e-3;
                    }
                }
                catch (e_363_1) { e_363 = { error: e_363_1 }; }
                finally {
                    try {
                        if (wetWindowMeshes_1_1 && !wetWindowMeshes_1_1.done && (_d = wetWindowMeshes_1.return)) _d.call(wetWindowMeshes_1);
                    }
                    finally { if (e_363) throw e_363.error; }
                }
                lineSign.emissiveIntensity = THREE.MathUtils.lerp(0.73, 1.03, amount);
                headlamp.emissiveIntensity = THREE.MathUtils.lerp(1.88, 3.55, amount);
            }
            return { lampX: lampX, setTramFinish: setTramFinish, updateTramMotion: updateTramMotion };
        }
        function buildRailPermanentWay(railway, approaches, halfSpan, routeEnd, _d) {
            var e_364, _e, e_365, _f;
            var material2 = _d.material, makeTexture = _d.makeTexture, instance = _d.instance, box2 = _d.box, cylinder2 = _d.cylinder, darkSteel = _d.darkSteel;
            var up = new THREE.Vector3(0, 1, 0);
            var identity = new THREE.Quaternion();
            var flipped = new THREE.Quaternion().setFromAxisAngle(up, Math.PI);
            var actualGauge = 0.49, tiePitch = 0.4;
            var sections = [
                { group: railway, from: -halfSpan, to: halfSpan },
                { group: approaches, from: -routeEnd, to: -halfSpan },
                { group: approaches, from: halfSpan, to: routeEnd }
            ];
            function railFinish(color, dry, wet, lamp, options) {
                if (lamp === void 0) { lamp = 0; }
                if (options === void 0) { options = {}; }
                var finish = material2(color, __spreadValues({ roughness: dry }, options));
                finish.userData.railWeather = { dry: dry, wet: wet, base: finish.color.toArray(), darken: options.metalness > 0.4 ? 0.91 : 0.82 };
                if (lamp)
                    finish.userData.headlightReceiver = lamp;
                return finish;
            }
            function repeat(map) {
                map.wrapS = map.wrapT = THREE.RepeatWrapping;
                return map;
            }
            var steelGrain = repeat(makeTexture(512, 48, function (ctx, w, h) {
                var rn = randomFrom(60719);
                var ground = ctx.createLinearGradient(0, 0, 0, h);
                ground.addColorStop(0, "#bbc1c7");
                ground.addColorStop(0.51, "#dce0df");
                ground.addColorStop(1, "#aeb7bf");
                ctx.fillStyle = ground;
                ctx.fillRect(0, 0, w, h);
                for (var i = 0; i < 340; i++) {
                    ctx.fillStyle = i % 3 ? "#5c63772a" : "#ffffff48";
                    ctx.fillRect(rn() * w, rn() * h, 4 + rn() * w * 0.15, 0.32 + rn() * 0.42);
                }
            }));
            var oxidation = repeat(makeTexture(416, 96, function (ctx, w, h) {
                var rn = randomFrom(62894);
                ctx.fillStyle = "#8d827d";
                ctx.fillRect(0, 0, w, h);
                for (var i = 0; i < 1480; i++) {
                    ctx.fillStyle = i % 3 ? "#4c414052" : "#c3b5a44d";
                    ctx.fillRect(rn() * w, rn() * h, 1 + rn() * 11, 0.45 + rn() * 1.8);
                }
                ctx.fillStyle = "#40393c47";
                ctx.fillRect(0, h * 0.76, w, h * 0.24);
            }));
            var runningBand = railFinish(11450562, 0.545, 0.305, 0.96, { metalness: 0.64, map: steelGrain });
            var headShoulder = railFinish(8489361, 0.67, 0.44, 0.55, { metalness: 0.47, map: steelGrain });
            var railWeb = railFinish(8616823, 0.84, 0.63, 0.25, { metalness: 0.31, map: oxidation });
            var fishSteel = railFinish(6644843, 0.78, 0.62, 0.15, { metalness: 0.26 });
            var retainer = railFinish(7961206, 0.75, 0.54, 0.17, { metalness: 0.31 });
            var plates = railFinish(5331812, 0.75, 0.51, 0.23, { metalness: 0.3 });
            var bolt = railFinish(8883857, 0.69, 0.48, 0.13, { metalness: 0.4 });
            var isolator = railFinish(3356480, 0.94, 0.76);
            var wood = makeTexture(728, 288, function (ctx, w, h) {
                var e_366, _d;
                var rn = randomFrom(19271);
                var ground = ctx.createLinearGradient(0, 0, 0, h);
                ground.addColorStop(0, "#766b64");
                ground.addColorStop(0.22, "#938276");
                ground.addColorStop(0.6, "#82766c");
                ground.addColorStop(1, "#6a625c");
                ctx.fillStyle = ground;
                ctx.fillRect(0, 0, w, h);
                for (var i = 0; i < 410; i++) {
                    var x = -90 + rn() * (w + 150), y = rn() * h, length = 38 + rn() * 355;
                    ctx.strokeStyle = i % 4 ? "#4a44444b" : "#baa8994b";
                    ctx.lineWidth = 0.3 + rn() * 1.6;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.bezierCurveTo(x + length * 0.28, y + (rn() - 0.5) * 12, x + length * 0.71, y + (rn() - 0.5) * 15, x + length, y + (rn() - 0.5) * 5);
                    ctx.stroke();
                }
                try {
                    for (var _e = __values([[0.24, 0.33, 16], [0.69, 0.68, 19], [0.88, 0.19, 11]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 3), at = _g[0], atY = _g[1], r = _g[2];
                        for (var i = 0; i < 6; i++) {
                            ctx.strokeStyle = i % 2 ? "#b5a2934d" : "#50444262";
                            ctx.lineWidth = 1.3;
                            ctx.beginPath();
                            ctx.ellipse(at * w, atY * h, r + 6 * i, 2.2 + i * 1.8, 0.031, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }
                }
                catch (e_366_1) { e_366 = { error: e_366_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_366) throw e_366.error; }
                }
                for (var i = 0; i < 11; i++) {
                    var y = rn() * h, x = (i % 2 ? rn() * 0.09 : 0.91 + rn() * 0.09) * w, len = 28 + rn() * 122;
                    ctx.strokeStyle = "#362d2b81";
                    ctx.lineWidth = 1.3 + rn() * 1.7;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + (i % 2 ? len : -len) * 0.48, y + 3);
                    ctx.lineTo(x + (i % 2 ? len : -len), y + 1);
                    ctx.stroke();
                }
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, h * 0.75, w, h * 0.25);
                ctx.clip();
                ctx.fillStyle = "#80746e";
                ctx.fillRect(0, h * 0.75, w, h * 0.25);
                for (var ring = 1; ring <= 14; ring++) {
                    ctx.strokeStyle = ring % 3 ? "#564b489c" : "#b4a392b8";
                    ctx.lineWidth = 1.2 + rn() * 1.9;
                    ctx.beginPath();
                    ctx.ellipse(w * 0.47, h * 0.95, ring * 37, ring * 8, 0.015, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.strokeStyle = "#443938a8";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(w * 0.46, h * 0.956);
                ctx.lineTo(w * 0.67, h * 0.906);
                ctx.lineTo(w * 0.97, h * 0.88);
                ctx.stroke();
                ctx.restore();
            });
            var timber = [14735827, 12829117, 15261395].map(function (color) { return railFinish(color, 0.89, 0.69, 0.31, { map: wood }); });
            var stone = repeat(makeTexture(608, 320, function (ctx, w, h) {
                var rn = randomFrom(49281);
                ctx.fillStyle = "#50545c";
                ctx.fillRect(0, 0, w, h);
                var chips = ["#676d73", "#5d6068", "#646260", "#414651", "#7a7876", "#525760"];
                for (var i = 0; i < 4800; i++) {
                    var x = rn() * w, y = rn() * h, r = 0.45 + rn() * 3.15;
                    ctx.fillStyle = chips[Math.floor(rn() * chips.length)];
                    ctx.beginPath();
                    ctx.moveTo(x - r, y + r * 0.4);
                    ctx.lineTo(x - r * 0.22, y - r * 0.62);
                    ctx.lineTo(x + r * 0.7, y - r * 0.44);
                    ctx.lineTo(x + r * 0.87, y + r * 0.18);
                    ctx.lineTo(x + r * 0.12, y + r * 0.77);
                    ctx.fill();
                }
                var edges = ctx.createLinearGradient(0, 0, 0, h);
                edges.addColorStop(0, "#272b3494");
                edges.addColorStop(0.2, "#383b4a00");
                edges.addColorStop(0.8, "#383b4a00");
                edges.addColorStop(1, "#272b3494");
                ctx.fillStyle = edges;
                ctx.fillRect(0, 0, w, h);
            }));
            var bed = railFinish(12764873, 0.98, 0.74, 0.36, { map: stone });
            var gritFinishes = [6185319, 7501174, 6381150].map(function (color) { return railFinish(color, 0.98, 0.81, 0.13); });
            var railProfile = [
                [-0.064, 5.315, railWeb],
                [0.064, 5.315, railWeb],
                [0.063, 5.326, railWeb],
                [0.027, 5.333, railWeb],
                [0.014, 5.342, railWeb],
                [0.014, 5.366, railWeb],
                [0.035, 5.375, headShoulder],
                [0.039, 5.383, headShoulder],
                [0.039, 5.396, headShoulder],
                [0.031, 5.404, runningBand],
                [0.021, 5.407, runningBand],
                [-0.021, 5.407, runningBand],
                [-0.031, 5.404, headShoulder],
                [-0.039, 5.396, headShoulder],
                [-0.039, 5.383, headShoulder],
                [-0.035, 5.375, railWeb],
                [-0.014, 5.366, railWeb],
                [-0.014, 5.342, railWeb],
                [-0.027, 5.333, railWeb],
                [-0.063, 5.326, railWeb]
            ];
            var deckProfile = [
                [-1.38, 5.105, bed],
                [1.38, 5.105, bed],
                [1.38, 5.154, bed],
                [1.08, 5.155, bed],
                [0.96, 5.181, bed],
                [-0.96, 5.181, bed],
                [-1.08, 5.155, bed],
                [-1.38, 5.154, bed]
            ];
            var byMaterial = new Map();
            function extrusion(group, profile, x0, x1, center, deck) {
                if (deck === void 0) { deck = false; }
                for (var i = 0; i < profile.length; i++) {
                    var _d = __read(profile[i], 3), za = _d[0], y0 = _d[1], finish = _d[2], _e = __read(profile[(i + 1) % profile.length], 2), zb = _e[0], y1 = _e[1];
                    var key = "".concat(group.id, "/").concat(finish.id);
                    if (!byMaterial.has(key))
                        byMaterial.set(key, { group: group, finish: finish, points: [], uvs: [], indices: [] });
                    var entry = byMaterial.get(key), z0 = za + center, z1 = zb + center;
                    var n = entry.points.length / 3;
                    entry.points.push(x0, y0, z0, x1, y0, z0, x1, y1, z1, x0, y1, z1);
                    var a = x0 / (deck ? 2.65 : 2.4), b = x1 / (deck ? 2.65 : 2.4);
                    var v0 = deck ? 0.5 + z0 / 2.8 : 0.5 + za * 6 + (y0 - 5.35) * 1.52;
                    var v1 = deck ? 0.5 + z1 / 2.8 : 0.5 + zb * 6 + (y1 - 5.35) * 1.52;
                    entry.uvs.push(a, v0, b, v0, b, v1, a, v1);
                    entry.indices.push(n, n + 1, n + 2, n, n + 2, n + 3);
                }
            }
            var woodShape = new THREE.Shape();
            woodShape.moveTo(-0.098, -0.046);
            woodShape.lineTo(0.098, -0.046);
            woodShape.lineTo(0.106, -0.034);
            woodShape.lineTo(0.106, 0.033);
            woodShape.lineTo(0.092, 0.046);
            woodShape.lineTo(-0.092, 0.046);
            woodShape.lineTo(-0.107, 0.034);
            woodShape.lineTo(-0.107, -0.036);
            woodShape.closePath();
            var tie = new THREE.ExtrudeGeometry(woodShape, {
                depth: 1.882,
                bevelEnabled: true,
                bevelSize: 9e-3,
                bevelThickness: 0.012,
                bevelSegments: 2,
                steps: 1
            });
            tie.name = "Chamfered timber sleepers";
            tie.translate(0, 0, -0.941);
            var position = tie.attributes.position, uv = tie.attributes.uv, normals = tie.attributes.normal;
            for (var i = 0; i < position.count; i++) {
                var x = position.getX(i), y = position.getY(i), z = position.getZ(i);
                if (Math.abs(normals.getZ(i)) > 0.69)
                    uv.setXY(i, 0.5 + x * 3.74, 0.136 + y * 1.7);
                else
                    uv.setXY(i, 0.5 + z / 1.923, 0.27 + 0.69 * (0.5 + x * 3.4 + y * 1.7));
            }
            var clipCurve = new THREE.CatmullRomCurve3([
                [-0.047, 9e-3, -0.037],
                [-0.018, 0.014, -0.024],
                [0.013, 0.022, -3e-3],
                [0.038, 0.02, 0.024],
                [0.03, 8e-3, 0.047],
                [-2e-3, 8e-3, 0.055],
                [-0.024, 7e-3, 0.053]
            ].map(function (point) {
                var _d;
                return new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(point), false)))();
            }));
            var clampGeometry = new THREE.TubeGeometry(clipCurve, 11, 0.0115, 6, false);
            clampGeometry.name = "Forged rail fasteners";
            var hexStud = new THREE.CylinderGeometry(1, 1, 1, 6);
            var pebble = new THREE.IcosahedronGeometry(1, 0);
            pebble.name = "Angular bed aggregate";
            var walkTexture = makeTexture(384, 128, function (ctx, w, h) {
                ctx.fillStyle = "#596069";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#333b45";
                ctx.fillRect(0, 0, w, 11);
                ctx.fillRect(0, h - 12, w, 12);
                for (var row = 0; row < 4; row++) {
                    for (var column = 0; column < 13; column++) {
                        var x = 8 + column * 29 + row % 2 * 7, y = 19 + row * 24;
                        ctx.fillStyle = "#2d333b";
                        ctx.fillRect(x, y, 19, 11);
                        ctx.fillStyle = "#8d9090";
                        ctx.fillRect(x, y + 9, 19, 2);
                    }
                }
                ctx.fillStyle = "#74818b";
                ctx.fillRect(0, 1, w, 2);
                ctx.fillRect(0, h - 3, w, 2);
            });
            var walk = railFinish(11252405, 0.79, 0.42, 0.16, { map: walkTexture, metalness: 0.3 });
            var trough = railFinish(4475215, 0.85, 0.58, 0.08, { metalness: 0.24 });
            var cable = railFinish(3553855, 0.88, 0.68, 0, { metalness: 0.12 });
            var renewal = railFinish(10590851, 0.82, 0.61, 0.16);
            var mainJoints = [-11.2, -5.6, 0, 5.6, 11.2];
            var fullJoints = __spreadArray(__spreadArray([-19.2], __read(mainJoints), false), [19.2], false);
            function sleeperAt(group, k) {
                var e_367, _d, e_368, _e;
                var x = (k + 0.5) * tiePitch;
                var rand = randomFrom(87457 + 199 * k);
                var variation = rand(), offset = (rand() - 0.5) * 0.053;
                var yaw = new THREE.Quaternion().setFromAxisAngle(up, (rand() - 0.5) * 0.028);
                var finish = timber[variation < 0.19 ? 1 : variation > 0.83 ? 2 : 0];
                instance(group, tie, finish, [0.95 + rand() * 0.13, 1, 0.976 + rand() * 0.06], [x, 5.235, offset], yaw, true);
                try {
                    for (var _f = __values([-actualGauge, actualGauge]), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var rail2 = _g.value;
                        box2(group, plates, [0.168, 0.018, 0.24], [x, 5.299, rail2], 0, false);
                        box2(group, isolator, [0.153, 9e-3, 0.139], [x, 5.312, rail2], 0, false);
                        try {
                            for (var _h = (e_368 = void 0, __values([-1, 1])), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var side = _j.value;
                                var z = rail2 + side * 0.073;
                                instance(group, clampGeometry, retainer, [1, 1, 1], [x, 5.319, z], side > 0 ? identity : flipped, false);
                                instance(group, hexStud, bolt, [0.016, 0.013, 0.016], [x + side * 4e-3, 5.332, z + side * 0.021], yaw, false);
                            }
                        }
                        catch (e_368_1) { e_368 = { error: e_368_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                            }
                            finally { if (e_368) throw e_368.error; }
                        }
                    }
                }
                catch (e_367_1) { e_367 = { error: e_367_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_367) throw e_367.error; }
                }
                for (var i = 0; i < 8; i++) {
                    var localX = x + 0.133 + rand() * 0.126;
                    var z = i < 4 ? (rand() - 0.5) * 1.72 : (i % 2 ? -1 : 1) * (0.89 + rand() * 0.137);
                    var r = 0.013 + rand() * 0.026;
                    var y = Math.abs(z) < 0.96 ? 5.187 : 5.176;
                    instance(group, pebble, gritFinishes[i % 3], [r * (0.79 + rand() * 0.7), r * 0.47, r], [localX, y, z], yaw, false);
                }
            }
            var _loop_27 = function (group, from, to) {
                var e_369, _l, e_370, _m, e_371, _o, e_372, _p, e_373, _q, e_374, _r;
                box2(group, darkSteel, [to - from, 0.18, 2.9], [(from + to) / 2, 5.02, 0]);
                extrusion(group, deckProfile, from, to, 0, true);
                var joints = fullJoints.filter(function (at) { return at > from && at < to; });
                var ends = __spreadArray(__spreadArray([from], __read(joints), false), [to], false);
                try {
                    for (var _s = (e_369 = void 0, __values([-actualGauge, actualGauge])), _t = _s.next(); !_t.done; _t = _s.next()) {
                        var z = _t.value;
                        for (var i = 1; i < ends.length; i++) {
                            var lo = ends[i - 1] + (i === 1 ? 0 : 7e-3), hi = ends[i] - (i === ends.length - 1 ? 0 : 7e-3);
                            extrusion(group, railProfile, lo, hi, z);
                        }
                        try {
                            for (var joints_1 = (e_370 = void 0, __values(joints)), joints_1_1 = joints_1.next(); !joints_1_1.done; joints_1_1 = joints_1.next()) {
                                var x = joints_1_1.value;
                                try {
                                    for (var _u = (e_371 = void 0, __values([-1, 1])), _v = _u.next(); !_v.done; _v = _u.next()) {
                                        var side = _v.value;
                                        box2(group, fishSteel, [0.547, 0.043, 0.029], [x, 5.348, z + side * 0.022], 0, false);
                                        box2(group, plates, [0.48, 9e-3, 0.012], [x, 5.365, z + side * 0.041], 0, false);
                                        try {
                                            for (var _w = (e_372 = void 0, __values([-0.187, -0.073, 0.073, 0.187])), _x = _w.next(); !_x.done; _x = _w.next()) {
                                                var dx = _x.value;
                                                cylinder2(group, bolt, 0.0117, 0.016, [x + dx, 5.348, z + side * 0.041], [0, 0, side]);
                                            }
                                        }
                                        catch (e_372_1) { e_372 = { error: e_372_1 }; }
                                        finally {
                                            try {
                                                if (_x && !_x.done && (_p = _w.return)) _p.call(_w);
                                            }
                                            finally { if (e_372) throw e_372.error; }
                                        }
                                    }
                                }
                                catch (e_371_1) { e_371 = { error: e_371_1 }; }
                                finally {
                                    try {
                                        if (_v && !_v.done && (_o = _u.return)) _o.call(_u);
                                    }
                                    finally { if (e_371) throw e_371.error; }
                                }
                            }
                        }
                        catch (e_370_1) { e_370 = { error: e_370_1 }; }
                        finally {
                            try {
                                if (joints_1_1 && !joints_1_1.done && (_m = joints_1.return)) _m.call(joints_1);
                            }
                            finally { if (e_370) throw e_370.error; }
                        }
                    }
                }
                catch (e_369_1) { e_369 = { error: e_369_1 }; }
                finally {
                    try {
                        if (_t && !_t.done && (_l = _s.return)) _l.call(_s);
                    }
                    finally { if (e_369) throw e_369.error; }
                }
                for (var k = Math.round(from / tiePitch); k < Math.round(to / tiePitch); k++)
                    sleeperAt(group, k);
                try {
                    for (var _y = (e_373 = void 0, __values([-1, 1])), _z = _y.next(); !_z.done; _z = _y.next()) {
                        var side = _z.value;
                        var z = side;
                        box2(group, trough, [to - from, 0.027, 0.058], [(from + to) / 2, 5.163, z * 1.052], 0, false);
                        box2(group, plates, [to - from, 0.038, 0.02], [(from + to) / 2, 5.184, z * 1.08], 0, false);
                        box2(group, cable, [to - from, 0.035, 0.036], [(from + to) / 2, 5.196, z * 1.309], 0, false);
                        var pitch = 0.79, n = Math.ceil((to - from) / pitch);
                        for (var i = 0; i < n; i++) {
                            var x0 = from + i * pitch, x1 = Math.min(to, x0 + pitch);
                            box2(group, walk, [Math.max(0.028, x1 - x0 - 0.013), 0.029, 0.201], [(x0 + x1) / 2, 5.19, z * 1.191], 0, false);
                            if (i % 2 === 0)
                                box2(group, bolt, [0.035, 0.051, 0.055], [(x0 + x1) / 2, 5.189, z * 1.309], 0, false);
                            if (i % 7 === 2)
                                box2(group, plates, [0.149, 0.011, 0.054], [(x0 + x1) / 2, 5.183, z * 1.052], 0, false);
                        }
                        try {
                            for (var _0 = (e_374 = void 0, __values([-5.6, 5.6])), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                                var x = _1.value;
                                if (x > from && x < to) {
                                    box2(group, renewal, [0.034, 5e-3, 0.098], [x, 5.207, z * 1.193], 0, false);
                                    box2(group, renewal, [0.021, 5e-3, 0.079], [x + 0.069, 5.207, z * 1.193], 0, false);
                                }
                            }
                        }
                        catch (e_374_1) { e_374 = { error: e_374_1 }; }
                        finally {
                            try {
                                if (_1 && !_1.done && (_r = _0.return)) _r.call(_0);
                            }
                            finally { if (e_374) throw e_374.error; }
                        }
                    }
                }
                catch (e_373_1) { e_373 = { error: e_373_1 }; }
                finally {
                    try {
                        if (_z && !_z.done && (_q = _y.return)) _q.call(_y);
                    }
                    finally { if (e_373) throw e_373.error; }
                }
            };
            try {
                for (var sections_1 = __values(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
                    var _g = sections_1_1.value, group = _g.group, from = _g.from, to = _g.to;
                    _loop_27(group, from, to);
                }
            }
            catch (e_364_1) { e_364 = { error: e_364_1 }; }
            finally {
                try {
                    if (sections_1_1 && !sections_1_1.done && (_e = sections_1.return)) _e.call(sections_1);
                }
                finally { if (e_364) throw e_364.error; }
            }
            try {
                for (var _h = __values(byMaterial.values()), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var _k = _j.value, group = _k.group, finish = _k.finish, points = _k.points, uvs = _k.uvs, indices = _k.indices;
                    var geometry = new THREE.BufferGeometry();
                    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
                    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
                    geometry.setIndex(indices);
                    geometry.computeVertexNormals();
                    var strip = new THREE.Mesh(geometry, finish);
                    strip.name = finish === runningBand ? "Polished rail running surfaces" : finish === bed ? "Grit bed and drained shoulders" : "Rail head or structural profile";
                    strip.castShadow = group === railway && finish !== bed;
                    strip.receiveShadow = true;
                    group.add(strip);
                }
            }
            catch (e_365_1) { e_365 = { error: e_365_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_f = _h.return)) _f.call(_h);
                }
                finally { if (e_365) throw e_365.error; }
            }
        }
        function buildRail(parent) {
            var e_375, _d, e_376, _e, e_377, _f, e_378, _g, e_379, _h, e_380, _j, e_381, _k, e_382, _l, e_383, _m, e_384, _o, e_385, _p, e_386, _q, e_387, _r;
            var halfSpan = SITE_HALF_WIDTH;
            var span = 2 * halfSpan;
            var routeEnd = halfSpan + RAIL_APPROACH_LENGTH;
            var railway = new THREE.Group();
            railway.name = "Y\u016Bnagi Line";
            railway.position.z = RAIL_CENTER_Z;
            parent.add(railway);
            var train2 = new THREE.Group();
            train2.name = "600\u5F62 tram";
            railway.add(train2);
            var edgePlanes = [
                new THREE.Plane(new THREE.Vector3(1, 0, 0), routeEnd),
                new THREE.Plane(new THREE.Vector3(-1, 0, 0), routeEnd)
            ];
            var staticMaterial = function (color, options) {
                if (options === void 0) { options = {}; }
                return new THREE.MeshStandardMaterial(__spreadValues({
                    color: color,
                    roughness: 0.72
                }, options));
            };
            var tramMaterial = function (color, options) {
                if (options === void 0) { options = {}; }
                return staticMaterial(color, __spreadValues({
                    clippingPlanes: edgePlanes,
                    clipShadows: true
                }, options));
            };
            var unitBox = new THREE.BoxGeometry();
            var unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 12);
            var unitDecal = new THREE.PlaneGeometry();
            var unitY = new THREE.Vector3(0, 1, 0);
            var transforms = new Map();
            var stamp = new THREE.Object3D();
            function instance(group, geometry, material2, size, center, rotation, shadows, receive) {
                var _d, _e;
                if (receive === void 0) { receive = true; }
                var key = "".concat(group.id, ".").concat(geometry.id, ".").concat(material2.id, ".").concat(shadows, ".").concat(receive);
                if (!transforms.has(key)) {
                    transforms.set(key, { group: group, geometry: geometry, material: material2, shadows: shadows, receive: receive, matrices: [] });
                }
                (_d = stamp.position).set.apply(_d, __spreadArray([], __read(center), false));
                (_e = stamp.scale).set.apply(_e, __spreadArray([], __read(size), false));
                stamp.quaternion.copy(rotation);
                stamp.updateMatrix();
                transforms.get(key).matrices.push(stamp.matrix.clone());
            }
            function box2(group, material2, size, center, angle, shadows) {
                if (angle === void 0) { angle = 0; }
                if (shadows === void 0) { shadows = true; }
                var orientation = new THREE.Quaternion().setFromAxisAngle(unitY, angle);
                instance(group, unitBox, material2, size, center, orientation, shadows);
            }
            function strut(group, material2, start, end, width, depth) {
                var _d, _e;
                if (depth === void 0) { depth = width; }
                var a = new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(start), false)))();
                var b = new ((_e = THREE.Vector3).bind.apply(_e, __spreadArray([void 0], __read(end), false)))();
                var direction = b.clone().sub(a);
                var orientation = new THREE.Quaternion().setFromUnitVectors(unitY, direction.clone().normalize());
                instance(group, unitBox, material2, [width, direction.length(), depth], a.lerp(b, 0.5).toArray(), orientation, true);
            }
            function cylinder2(group, material2, radius, length, center, axis, shadows) {
                var _d;
                if (shadows === void 0) { shadows = false; }
                var orientation = new THREE.Quaternion().setFromUnitVectors(unitY, new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(axis), false)))());
                instance(group, unitCylinder, material2, [radius, length, radius], center, orientation, shadows);
            }
            function makeTexture(width, height, draw) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                draw(canvas.getContext("2d"), width, height);
                var map = new THREE.CanvasTexture(canvas);
                map.colorSpace = THREE.SRGBColorSpace;
                map.anisotropy = 8;
                return map;
            }
            function decal(group, material2, width, height, position, faceAngle) {
                if (faceAngle === void 0) { faceAngle = 0; }
                var rotation = new THREE.Quaternion().setFromAxisAngle(unitY, faceAngle);
                instance(group, unitDecal, material2, [width, height, 1], position, rotation, false, false);
            }
            function wire(material2, points, radius, group) {
                if (group === void 0) { group = railway; }
                var curve = new THREE.CatmullRomCurve3(points.map(function (point) {
                    var _d;
                    return new ((_d = THREE.Vector3).bind.apply(_d, __spreadArray([void 0], __read(point), false)))();
                }));
                var mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, radius, 5, false), material2);
                group.add(mesh);
            }
            var blueSteel = staticMaterial(6387073, { metalness: 0.13 });
            var steelEdge = staticMaterial(9083809, { metalness: 0.2, roughness: 0.69 });
            var darkSteel = staticMaterial(5070955, { metalness: 0.14 });
            var concrete = staticMaterial(9406864);
            var concreteInset = staticMaterial(7829120);
            var concreteEdge = staticMaterial(10394785);
            var insulator = staticMaterial(10126431);
            var crossBeamCount = Math.round(span / 2.15);
            for (var i = 0; i <= crossBeamCount; i++) {
                var x = THREE.MathUtils.lerp(0.7 - halfSpan, halfSpan - 0.7, i / crossBeamCount);
                box2(railway, blueSteel, [0.2, 0.22, 3.01], [x, 4.89, 0]);
            }
            try {
                for (var _s = __values([-1, 1]), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var side = _t.value;
                    var z = side * 1.42;
                    box2(railway, blueSteel, [span, 0.22, 0.24], [0, 5.48, z]);
                    box2(railway, steelEdge, [span, 0.046, 0.27], [0, 5.608, z]);
                    box2(railway, blueSteel, [span, 0.21, 0.23], [0, 4.29, z]);
                    box2(railway, steelEdge, [span, 0.055, 0.26], [0, 4.402, z]);
                    var leftEnd = -halfSpan + 0.11;
                    var panelCount = 2 * Math.max(1, Math.round(span / 3));
                    var panelWidth = -2 * leftEnd / panelCount;
                    for (var panel = 0; panel <= panelCount; panel++) {
                        var x = leftEnd + panel * panelWidth;
                        var y = panel % 2 === 0 ? 4.32 : 5.45;
                        if (panel < panelCount) {
                            strut(railway, blueSteel, [x, y, z], [x + panelWidth, 9.77 - y, z], 0.18, 0.19);
                            strut(railway, steelEdge, [x, y, z + side * 0.099], [x + panelWidth, 9.77 - y, z + side * 0.099], 0.037, 0.035);
                        }
                        if (panel % 2 === 0) {
                            box2(railway, blueSteel, [0.115, 1.13, 0.15], [x, 4.885, z]);
                        }
                        box2(railway, steelEdge, [0.21, 0.23, 0.039], [x, y, z + side * 0.135], 0, false);
                        try {
                            for (var _u = (e_376 = void 0, __values([-0.057, 0.057])), _v = _u.next(); !_v.done; _v = _u.next()) {
                                var dx = _v.value;
                                try {
                                    for (var _w = (e_377 = void 0, __values([-0.065, 0.065])), _x = _w.next(); !_x.done; _x = _w.next()) {
                                        var dy = _x.value;
                                        cylinder2(railway, darkSteel, 0.021, 0.019, [x + dx, y + dy, z + side * 0.162], [0, 0, side]);
                                    }
                                }
                                catch (e_377_1) { e_377 = { error: e_377_1 }; }
                                finally {
                                    try {
                                        if (_x && !_x.done && (_f = _w.return)) _f.call(_w);
                                    }
                                    finally { if (e_377) throw e_377.error; }
                                }
                            }
                        }
                        catch (e_376_1) { e_376 = { error: e_376_1 }; }
                        finally {
                            try {
                                if (_v && !_v.done && (_e = _u.return)) _e.call(_u);
                            }
                            finally { if (e_376) throw e_376.error; }
                        }
                    }
                }
            }
            catch (e_375_1) { e_375 = { error: e_375_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_d = _s.return)) _d.call(_s);
                }
                finally { if (e_375) throw e_375.error; }
            }
            var pierPositions = [-8.5, 7.7];
            try {
                for (var pierPositions_1 = __values(pierPositions), pierPositions_1_1 = pierPositions_1.next(); !pierPositions_1_1.done; pierPositions_1_1 = pierPositions_1.next()) {
                    var x = pierPositions_1_1.value;
                    box2(railway, concreteInset, [1.03, 0.39, 3.21], [x, 4.02, 0]);
                    box2(railway, concreteEdge, [1.11, 0.125, 3.32], [x, 4.16, 0]);
                    try {
                        for (var _y = (e_379 = void 0, __values([-0.95, 0.95])), _z = _y.next(); !_z.done; _z = _y.next()) {
                            var z = _z.value;
                            box2(railway, concreteInset, [0.81, 0.23, 0.86], [x, 0.245, z]);
                            box2(railway, concrete, [0.65, 3.47, 0.68], [x, 2.025, z]);
                            box2(railway, concreteEdge, [0.69, 0.23, 0.72], [x, 3.74, z]);
                            box2(railway, concreteInset, [0.065, 2.91, 0.035], [x - 0.237, 2.06, z + 0.344], 0, false);
                            try {
                                for (var _0 = (e_380 = void 0, __values([0.46, 1.41, 2.52, 3.35])), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                                    var y = _1.value;
                                    box2(railway, concreteInset, [0.64, 0.017, 0.026], [x, y, z + 0.341], 0, false);
                                }
                            }
                            catch (e_380_1) { e_380 = { error: e_380_1 }; }
                            finally {
                                try {
                                    if (_1 && !_1.done && (_j = _0.return)) _j.call(_0);
                                }
                                finally { if (e_380) throw e_380.error; }
                            }
                            try {
                                for (var _2 = (e_381 = void 0, __values([-0.238, -0.17, 0.07, 0.18])), _3 = _2.next(); !_3.done; _3 = _2.next()) {
                                    var dx = _3.value;
                                    var stain = 0.93 + (dx + 0.25) * 5;
                                    box2(railway, concreteInset, [0.012, 0.34 + Math.abs(dx) * 1.24, 8e-3], [x + dx, stain, z + 0.349], 0, false);
                                }
                            }
                            catch (e_381_1) { e_381 = { error: e_381_1 }; }
                            finally {
                                try {
                                    if (_3 && !_3.done && (_k = _2.return)) _k.call(_2);
                                }
                                finally { if (e_381) throw e_381.error; }
                            }
                        }
                    }
                    catch (e_379_1) { e_379 = { error: e_379_1 }; }
                    finally {
                        try {
                            if (_z && !_z.done && (_h = _y.return)) _h.call(_y);
                        }
                        finally { if (e_379) throw e_379.error; }
                    }
                }
            }
            catch (e_378_1) { e_378 = { error: e_378_1 }; }
            finally {
                try {
                    if (pierPositions_1_1 && !pierPositions_1_1.done && (_g = pierPositions_1.return)) _g.call(pierPositions_1);
                }
                finally { if (e_378) throw e_378.error; }
            }
            var routePlate = makeTexture(384, 112, function (ctx, w, h) {
                ctx.fillStyle = "#c3a77a";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#234e4a";
                ctx.fillRect(7, 7, w - 14, h - 14);
                ctx.strokeStyle = "#c3a77a";
                ctx.lineWidth = 2;
                ctx.strokeRect(13, 13, w - 26, h - 26);
                ctx.textAlign = "center";
                ctx.fillStyle = "#f6e6bc";
                ctx.font = '700 39px "Yu Gothic", Meiryo, sans-serif';
                ctx.fillText("\u5915\u51EA\u7DDA", w / 2, 57);
                ctx.font = "600 17px sans-serif";
                ctx.fillText("Y U N A G I   L I N E", w / 2, 83);
            });
            var plaqueMat = staticMaterial(16777215, { map: routePlate });
            box2(railway, darkSteel, [1.75, 0.51, 0.085], [0, 4.92, 1.558]);
            decal(railway, plaqueMat, 1.66, 0.44, [0, 4.92, 1.608]);
            var westMast = -halfSpan + 0.78;
            var eastMast = halfSpan - 0.78;
            try {
                for (var _4 = __values([westMast, eastMast]), _5 = _4.next(); !_5.done; _5 = _4.next()) {
                    var x = _5.value;
                    box2(railway, darkSteel, [0.34, 0.18, 0.29], [x, 5.26, -1.25]);
                    box2(railway, steelEdge, [0.12, 3.17, 0.115], [x, 6.9, -1.25]);
                    box2(railway, darkSteel, [0.11, 0.091, 1.28], [x, 8.4, -0.65]);
                    strut(railway, steelEdge, [x, 7.87, -1.23], [x, 8.39, -0.18], 0.041);
                    try {
                        for (var _6 = (e_383 = void 0, __values([8.22, 8.3, 8.38])), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                            var y = _7.value;
                            cylinder2(railway, insulator, 0.067, 0.035, [x, y, 0], [0, 1, 0]);
                        }
                    }
                    catch (e_383_1) { e_383 = { error: e_383_1 }; }
                    finally {
                        try {
                            if (_7 && !_7.done && (_m = _6.return)) _m.call(_6);
                        }
                        finally { if (e_383) throw e_383.error; }
                    }
                }
            }
            catch (e_382_1) { e_382 = { error: e_382_1 }; }
            finally {
                try {
                    if (_5 && !_5.done && (_l = _4.return)) _l.call(_4);
                }
                finally { if (e_382) throw e_382.error; }
            }
            var catenarySupports = [8.44, 8.34, 8.29, 8.27, 8.29, 8.34, 8.44].map(function (height, i) { return [
                THREE.MathUtils.lerp(westMast, eastMast, i / 6),
                height,
                0
            ]; });
            wire(darkSteel, [[-halfSpan, 8.17, 0], [0, 8.13, 0], [halfSpan, 8.17, 0]], 0.021);
            wire(darkSteel, __spreadArray(__spreadArray([[-halfSpan, 8.38, 0]], __read(catenarySupports), false), [[halfSpan, 8.34, 0]], false), 0.018);
            try {
                for (var catenarySupports_1 = __values(catenarySupports), catenarySupports_1_1 = catenarySupports_1.next(); !catenarySupports_1_1.done; catenarySupports_1_1 = catenarySupports_1.next()) {
                    var _8 = __read(catenarySupports_1_1.value, 2), x = _8[0], top = _8[1];
                    strut(railway, darkSteel, [x, 8.15, 0], [x, top, 0], 0.021);
                }
            }
            catch (e_384_1) { e_384 = { error: e_384_1 }; }
            finally {
                try {
                    if (catenarySupports_1_1 && !catenarySupports_1_1.done && (_o = catenarySupports_1.return)) _o.call(catenarySupports_1);
                }
                finally { if (e_384) throw e_384.error; }
            }
            var approaches = new THREE.Group();
            approaches.name = "Rail approaches beyond the diorama";
            railway.add(approaches);
            var approachPanels = 6;
            var approachPitch = RAIL_APPROACH_LENGTH / approachPanels;
            var _loop_28 = function (direction) {
                var e_388, _17, e_389, _18;
                var middle = direction * (halfSpan + RAIL_APPROACH_LENGTH / 2);
                var beam = function (finish, y, z, height, width) {
                    box2(approaches, finish, [RAIL_APPROACH_LENGTH, height, width], [middle, y, z], 0, false);
                };
                try {
                    for (var _19 = (e_388 = void 0, __values([-1, 1])), _20 = _19.next(); !_20.done; _20 = _19.next()) {
                        var side = _20.value;
                        var z = side * 1.42;
                        beam(blueSteel, 5.48, z, 0.22, 0.24);
                        beam(steelEdge, 5.608, z, 0.046, 0.27);
                        beam(blueSteel, 4.29, z, 0.21, 0.23);
                        beam(steelEdge, 4.402, z, 0.055, 0.26);
                        for (var panel = 0; panel < approachPanels; panel++) {
                            var x = direction * (halfSpan + panel * approachPitch);
                            var nextX = x + direction * approachPitch;
                            var low = panel % 2 === 0;
                            var y = low ? 4.32 : 5.45;
                            strut(approaches, blueSteel, [x, y, z], [nextX, 9.77 - y, z], 0.18, 0.19);
                            box2(approaches, steelEdge, [0.21, 0.23, 0.039], [nextX, 9.77 - y, z + side * 0.135], 0, false);
                            if (!low)
                                box2(approaches, blueSteel, [0.115, 1.13, 0.15], [nextX, 4.885, z], 0, false);
                        }
                    }
                }
                catch (e_388_1) { e_388 = { error: e_388_1 }; }
                finally {
                    try {
                        if (_20 && !_20.done && (_17 = _19.return)) _17.call(_19);
                    }
                    finally { if (e_388) throw e_388.error; }
                }
                try {
                    for (var _21 = (e_389 = void 0, __values([[8.17, 0.021], [direction < 0 ? 8.38 : 8.34, 0.018]])), _22 = _21.next(); !_22.done; _22 = _21.next()) {
                        var _23 = __read(_22.value, 2), height = _23[0], radius = _23[1];
                        wire(darkSteel, [
                            [direction * halfSpan, height, 0],
                            [middle, height - 0.13, 0],
                            [direction * routeEnd, height, 0]
                        ], radius, approaches);
                    }
                }
                catch (e_389_1) { e_389 = { error: e_389_1 }; }
                finally {
                    try {
                        if (_22 && !_22.done && (_18 = _21.return)) _18.call(_21);
                    }
                    finally { if (e_389) throw e_389.error; }
                }
            };
            try {
                for (var _9 = __values([-1, 1]), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                    var direction = _10.value;
                    _loop_28(direction);
                }
            }
            catch (e_385_1) { e_385 = { error: e_385_1 }; }
            finally {
                try {
                    if (_10 && !_10.done && (_p = _9.return)) _p.call(_9);
                }
                finally { if (e_385) throw e_385.error; }
            }
            buildRailPermanentWay(railway, approaches, halfSpan, routeEnd, {
                material: staticMaterial,
                makeTexture: makeTexture,
                instance: instance,
                box: box2,
                cylinder: cylinder2,
                darkSteel: darkSteel
            });
            var _11 = buildHeroTram(train2, edgePlanes, makeTexture, tramMaterial), lampX = _11.lampX, setTramFinish = _11.setTramFinish, updateTramMotion = _11.updateTramMotion;
            var _loop_29 = function (group, geometry, material2, shadows, receive, matrices) {
                var batch = new THREE.InstancedMesh(geometry, material2, matrices.length);
                matrices.forEach(function (matrix2, index) { return batch.setMatrixAt(index, matrix2); });
                batch.castShadow = shadows && group !== approaches;
                batch.receiveShadow = receive;
                if (geometry.name)
                    batch.name = geometry.name;
                group.add(batch);
            };
            try {
                for (var _12 = __values(transforms.values()), _13 = _12.next(); !_13.done; _13 = _12.next()) {
                    var _14 = _13.value, group = _14.group, geometry = _14.geometry, material2 = _14.material, shadows = _14.shadows, receive = _14.receive, matrices = _14.matrices;
                    _loop_29(group, geometry, material2, shadows, receive, matrices);
                }
            }
            catch (e_386_1) { e_386 = { error: e_386_1 }; }
            finally {
                try {
                    if (_13 && !_13.done && (_q = _12.return)) _q.call(_12);
                }
                finally { if (e_386) throw e_386.error; }
            }
            var approachMaterials = new Map();
            darkSteel.userData.headlightReceiver = 0.27;
            try {
                for (var _15 = __values(approaches.children), _16 = _15.next(); !_16.done; _16 = _15.next()) {
                    var mesh = _16.value;
                    if (!approachMaterials.has(mesh.material)) {
                        approachMaterials.set(mesh.material, mesh.material.clone());
                    }
                    mesh.material = approachMaterials.get(mesh.material);
                }
            }
            catch (e_387_1) { e_387 = { error: e_387_1 }; }
            finally {
                try {
                    if (_16 && !_16.done && (_r = _15.return)) _r.call(_15);
                }
                finally { if (e_387) throw e_387.error; }
            }
            addRailMistPass(approaches, "Mist on the railway approaches");
            var trackFinishes = new Set();
            railway.traverse(function (object) {
                var _a, _b;
                if ((_b = (_a = object.material) == null ? void 0 : _a.userData) == null ? void 0 : _b.railWeather)
                    trackFinishes.add(object.material);
            });
            function setTrackRain(amount) {
                var e_390, _d;
                try {
                    for (var trackFinishes_1 = __values(trackFinishes), trackFinishes_1_1 = trackFinishes_1.next(); !trackFinishes_1_1.done; trackFinishes_1_1 = trackFinishes_1.next()) {
                        var finish = trackFinishes_1_1.value;
                        var _e = finish.userData.railWeather, dry = _e.dry, wet = _e.wet, base = _e.base, darken = _e.darken;
                        var tint = THREE.MathUtils.lerp(1, darken, amount);
                        finish.roughness = THREE.MathUtils.lerp(dry, wet, amount);
                        finish.color.setRGB(base[0] * tint, base[1] * tint, base[2] * tint);
                    }
                }
                catch (e_390_1) { e_390 = { error: e_390_1 }; }
                finally {
                    try {
                        if (trackFinishes_1_1 && !trackFinishes_1_1.done && (_d = trackFinishes_1.return)) _d.call(trackFinishes_1);
                    }
                    finally { if (e_390) throw e_390.error; }
                }
            }
            var trainMistPass = addRailMistPass(train2, "Mist on the tram");
            var wetMistPane = trainMistPass.getObjectByName("Rain on the tram panes");
            var trainHalfLength = new THREE.Box3().setFromObject(train2).getSize(new THREE.Vector3()).x / 2;
            var headlightX = { value: lampX };
            var setBeamRain = buildTramHeadlightBeams(train2, lampX, routeEnd);
            var visibleLimit = routeEnd + trainHalfLength;
            var turnAround = halfSpan + trainHalfLength + 1.5;
            var period = 25;
            var showcaseCenter = 1.8;
            function updateRail(seconds) {
                var travel = THREE.MathUtils.euclideanModulo(seconds + period / 2, period) / (period / 2) - 1;
                var reach = turnAround - Math.sign(travel) * showcaseCenter;
                var center = showcaseCenter + travel * 5.9 + __pow(travel, 3) * (reach - 5.9);
                var approach = THREE.MathUtils.smoothstep(Math.abs(center), halfSpan - 1, turnAround);
                train2.position.x = center + Math.sign(center) * approach * RAIL_APPROACH_LENGTH;
                headlightX.value = train2.position.x + lampX;
                var distance = Math.abs(train2.position.x);
                train2.visible = distance <= visibleLimit;
                if (train2.visible)
                    updateTramMotion(seconds, train2.position.x);
                trainMistPass.visible = distance + trainHalfLength > halfSpan + 1.8;
                return Math.exp(-distance * distance / 13);
            }
            updateRail(0);
            return { update: updateRail, headlightX: headlightX, setRain: function (amount) {
                    setTrackRain(amount);
                    setTramFinish(amount);
                    if (wetMistPane)
                        wetMistPane.visible = amount > 4e-3;
                    setBeamRain(amount);
                } };
        }
        function buildRainWeather(parent) {
            var e_391, _d;
            var group = new THREE.Group();
            group.name = "Rain and pavement ripples";
            group.visible = false;
            parent.add(group);
            var rng = randomFrom(8819);
            var halo = 1.36;
            var uniforms = {
                rainTime: { value: 0 },
                rainAmount: { value: 0 },
                rainSlope: { value: new THREE.Vector2(0.31, 0.05) },
                rainSite: { value: new THREE.Vector3(SITE_HALF_WIDTH, SITE_LENGTH / 2, SITE_CENTER_Z) },
                rainHalo: { value: halo }
            };
            var _e = uniforms.rainSlope.value, slopeX = _e.x, slopeZ = _e.y;
            var shelter = [
                [-SITE_HALF_WIDTH - RAIL_APPROACH_LENGTH, SITE_HALF_WIDTH + RAIL_APPROACH_LENGTH, RAIL_CENTER_Z - 1.55, RAIL_CENTER_Z + 1.55, 5.43],
                [-8.42, -3.04, 1.7, 6.54, 6.31],
                [-7.95, -5.31, 6.03, 6.86, 2.38],
                [-3.53, -2.92, 3.54, 6.09, 2.37],
                [-12.49, -8.69, -0.33, 4.01, 4.96],
                [-11.97, -9.56, 3.75, 4.47, 2.57],
                [-7.93, -2.75, -14.98, -7.76, 3.603],
                [-2.96, -2.33, -14.93, -7.86, 2.98],
                [-11.72, -6.68, 8.04, 13.02, 8.62],
                [-11.42, -9.04, 12.77, 13.56, 2.48],
                [-6.96, -6.14, 9.1, 11.54, 2.48],
                [-12.34, -8.61, -14.23, -9.09, 9.95],
                [7.62, 11.64, -14.07, -9.33, 7.7],
                [7.8, 10.02, -9.58, -8.81, 2.29],
                [11.39, 12.05, -13.63, -11.1, 2.38],
                [-7.1, -1.39, -4.43, -1.58, 3.94],
                [9.21, 12.09, 3.57, 6.61, 2.88],
                [7.36, 11.02, 11.34, 12.98, 1.91]
            ];
            function firstImpact(x, z) {
                var e_392, _d;
                var height = 0.2;
                try {
                    for (var shelter_1 = __values(shelter), shelter_1_1 = shelter_1.next(); !shelter_1_1.done; shelter_1_1 = shelter_1.next()) {
                        var _e = __read(shelter_1_1.value, 5), left = _e[0], right = _e[1], back = _e[2], front = _e[3], roof = _e[4];
                        var enter = Math.min(roof, (x - left) / slopeX, (z - back) / slopeZ);
                        var exit = Math.max(0, (x - right) / slopeX, (z - front) / slopeZ);
                        if (enter >= exit)
                            height = Math.max(height, enter);
                    }
                }
                catch (e_392_1) { e_392 = { error: e_392_1 }; }
                finally {
                    try {
                        if (shelter_1_1 && !shelter_1_1.done && (_d = shelter_1.return)) _d.call(shelter_1);
                    }
                    finally { if (e_392) throw e_392.error; }
                }
                return height;
            }
            function quadGeometry(count) {
                var geometry = new THREE.InstancedBufferGeometry();
                geometry.instanceCount = count;
                geometry.setAttribute("position", new THREE.Float32BufferAttribute([
                    -1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    -1,
                    1,
                    0,
                    1,
                    1,
                    0
                ], 3));
                geometry.setIndex([0, 1, 2, 1, 3, 2]);
                return geometry;
            }
            var paths = [];
            var drops = [];
            var dropCount = 1240;
            var spreadX = SITE_HALF_WIDTH * halo;
            var spreadZ = SITE_LENGTH / 2 * halo;
            for (var i = 0; i < dropCount; i++) {
                var upper = 12.2 + rng() * 4.7;
                var x = THREE.MathUtils.lerp(-spreadX, spreadX + upper * slopeX, rng());
                var z = SITE_CENTER_Z + THREE.MathUtils.lerp(-spreadZ, spreadZ + upper * slopeZ, rng());
                paths.push(x, z, firstImpact(x, z), upper);
                drops.push(rng(), 7.9 + rng() * 5, 0.23 + rng() * 0.29, 0.027 + rng() * 0.022);
            }
            var streaks = quadGeometry(dropCount);
            streaks.setAttribute("rainPath", new THREE.InstancedBufferAttribute(new Float32Array(paths), 4));
            streaks.setAttribute("rainDrop", new THREE.InstancedBufferAttribute(new Float32Array(drops), 4));
            var streakFinish = new THREE.ShaderMaterial({
                uniforms: uniforms,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                forceSinglePass: true,
                vertexShader: "\n          attribute vec4 rainPath;\n          attribute vec4 rainDrop;\n          uniform float rainTime;\n          uniform vec2 rainSlope;\n          uniform vec3 rainSite;\n          uniform float rainHalo;\n          varying vec2 streakUV;\n          varying float streakOpacity;\n\n          void main() {\n            float lower = rainPath.z;\n            float upper = rainPath.w;\n            float phase = fract(rainDrop.x + rainTime * rainDrop.y / (upper - lower));\n            float height = mix(upper, lower, phase);\n            vec3 center = vec3(rainPath.x - rainSlope.x * height, height, rainPath.y - rainSlope.y * height);\n            vec3 tail = vec3(-rainSlope.x,1.0,-rainSlope.y);\n            vec4 view = modelViewMatrix * vec4(center + tail * position.y * rainDrop.z,1.0);\n            vec2 direction = (modelViewMatrix * vec4(tail,0.0)).xy;\n            vec2 across = vec2(direction.y,-direction.x) / max(length(direction),0.001);\n            view.xy += position.x * rainDrop.w * across;\n\n            vec2 distanceToCenter = abs(vec2(center.x,center.z - rainSite.z) / rainSite.xy);\n            float edge = max(distanceToCenter.x,distanceToCenter.y);\n            float perimeter = 1.0-smoothstep(0.72,rainHalo,edge);\n            float heightFade = 1.0-smoothstep(9.5,16.2,height);\n            float lifespanFade = smoothstep(0.0,0.13,phase) * (1.0-smoothstep(0.94,1.0,phase));\n            streakOpacity = perimeter * heightFade * lifespanFade * mix(0.15,0.38,rainDrop.x);\n            streakUV = position.xy;\n            gl_Position = projectionMatrix * view;\n          }",
                fragmentShader: "\n          uniform float rainAmount;\n          varying vec2 streakUV;\n          varying float streakOpacity;\n\n          void main() {\n            float crossSection = 1.0-smoothstep(0.04,1.0,abs(streakUV.x));\n            float taper = smoothstep(0.0,0.15,streakUV.y) * (1.0-smoothstep(0.25,1.0,streakUV.y));\n            float alpha = crossSection * taper * streakOpacity * rainAmount;\n            gl_FragColor = vec4(0.48,0.64,0.82,alpha);\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n          }"
            });
            var rain = new THREE.Mesh(streaks, streakFinish);
            rain.name = "Wind-driven rain";
            rain.frustumCulled = false;
            rain.renderOrder = 7;
            var groundPositions = [];
            var rippleTiming = [];
            try {
                for (var _f = __values([
                    [172, ROAD_LEFT + 0.28, ROAD_RIGHT - 0.28, SITE_BACK + 0.35, SITE_FRONT - 0.35, 0.024],
                    [44, 5.71, 11.32, 8.53, 13.54, 0.207]
                ]), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 6), count = _h[0], left = _h[1], right = _h[2], back = _h[3], front = _h[4], y = _h[5];
                    var placed = 0;
                    while (placed < count) {
                        var x = THREE.MathUtils.lerp(left, right, rng());
                        var z = THREE.MathUtils.lerp(back, front, rng());
                        if (firstImpact(x, z) > 0.2 || Math.abs(z - RAIL_CENTER_Z) < 1.83)
                            continue;
                        var level = x >= ROAD_LEFT && x <= ROAD_RIGHT ? y + roadHeight(x) - 6e-3 : y;
                        groundPositions.push(x, level, z);
                        rippleTiming.push(rng(), 0.54 + rng() * 0.76, 0.12 + rng() * 0.15);
                        placed++;
                    }
                }
            }
            catch (e_391_1) { e_391 = { error: e_391_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                }
                finally { if (e_391) throw e_391.error; }
            }
            var rings = quadGeometry(groundPositions.length / 3);
            rings.setAttribute("ripplePosition", new THREE.InstancedBufferAttribute(new Float32Array(groundPositions), 3));
            rings.setAttribute("rippleTiming", new THREE.InstancedBufferAttribute(new Float32Array(rippleTiming), 3));
            var ringFinish = new THREE.ShaderMaterial({
                uniforms: uniforms,
                transparent: true,
                depthWrite: false,
                vertexShader: "\n          attribute vec3 ripplePosition;\n          attribute vec3 rippleTiming;\n          uniform float rainTime;\n          uniform vec3 rainSite;\n          varying vec2 ringUV;\n          varying float ringAge;\n          varying float ringOpacity;\n\n          void main() {\n            ringAge = fract(rippleTiming.x + rainTime * rippleTiming.y) / 0.48;\n            float edge = abs(ripplePosition.z-rainSite.z) / rainSite.y;\n            float perimeter = 1.0-smoothstep(0.79,1.0,edge);\n            ringOpacity = 0.21 * (1.0-smoothstep(0.30,1.0,ringAge)) * perimeter;\n            ringUV = vec2(position.x,1.0-2.0*position.y);\n            vec3 surface = ripplePosition + vec3(ringUV.x,0.0,ringUV.y) * rippleTiming.z;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(surface,1.0);\n          }",
                fragmentShader: "\n          uniform float rainAmount;\n          varying vec2 ringUV;\n          varying float ringAge;\n          varying float ringOpacity;\n\n          void main() {\n            if (ringAge > 1.0) discard;\n            float radial = length(ringUV);\n            float radius = mix(0.12,0.86,ringAge);\n            float width = clamp(fwidth(radial) * 0.55,0.04,0.22);\n            float ring = 1.0-smoothstep(0.04,0.055+width,abs(radial-radius));\n            float highlight = 0.64 + 0.24 * sin(ringUV.x * 11.0 + ringUV.y * 6.0);\n            float impact = (1.0-smoothstep(0.07,0.15,radial)) * (1.0-smoothstep(0.0,0.20,ringAge));\n            float alpha = max(ring * highlight,impact) * ringOpacity * rainAmount;\n            gl_FragColor = vec4(0.37,0.53,0.66,alpha);\n            #include <tonemapping_fragment>\n            #include <colorspace_fragment>\n          }"
            });
            var ripples = new THREE.Mesh(rings, ringFinish);
            ripples.name = "Rain impacts on exposed asphalt";
            ripples.frustumCulled = false;
            ripples.renderOrder = 6;
            group.add(ripples, rain);
            return {
                group: group,
                update: function (seconds, amount) {
                    uniforms.rainTime.value = seconds;
                    uniforms.rainAmount.value = THREE.MathUtils.clamp(amount, 0, 1);
                    group.visible = amount > 0;
                }
            };
        }
        function createWeatherSky() {
            var clear = paintEveningSky();
            var rainy = paintedTexture(768, 512, function (ctx2, w, h) {
                var e_393, _d;
                var sky2 = ctx2.createLinearGradient(0, 0, w * 0.16, h);
                try {
                    for (var _e = __values([[0, "#485f7b"], [0.29, "#708aa2"], [0.53, "#a4b9c9"], [0.77, "#b5c6cf"], [1, "#7998ad"]]), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 2), at = _g[0], tint = _g[1];
                        sky2.addColorStop(at, tint);
                    }
                }
                catch (e_393_1) { e_393 = { error: e_393_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                    }
                    finally { if (e_393) throw e_393.error; }
                }
                ctx2.fillStyle = sky2;
                ctx2.fillRect(0, 0, w, h);
                var random = randomFrom(3219);
                for (var i = 0; i < 25; i++) {
                    ctx2.save();
                    ctx2.translate((random() * 1.5 - 0.25) * w, (0.1 + random() * 0.44) * h);
                    ctx2.scale(2.8, 0.36);
                    var radius = 60 + random() * 80;
                    var cloud = ctx2.createRadialGradient(0, 0, 0, 0, 0, radius);
                    cloud.addColorStop(0, i % 3 ? "#e9edf31d" : "#3b536e28");
                    cloud.addColorStop(1, i % 3 ? "#e9edf300" : "#3b536e00");
                    ctx2.fillStyle = cloud;
                    ctx2.fillRect(-radius, -radius, 2 * radius, 2 * radius);
                    ctx2.restore();
                }
            });
            var texture = paintedTexture(768, 512, function () {
            });
            var canvas = texture.image, ctx = canvas.getContext("2d");
            var last = -1;
            function setAmount(amount) {
                if (amount === last)
                    return;
                last = amount;
                ctx.globalAlpha = 1;
                ctx.drawImage(clear.image, 0, 0, canvas.width, canvas.height);
                if (amount > 0) {
                    ctx.globalAlpha = amount;
                    ctx.drawImage(rainy.image, 0, 0, canvas.width, canvas.height);
                }
                ctx.globalAlpha = 1;
                texture.needsUpdate = true;
            }
            setAmount(0);
            clear.dispose();
            rainy.dispose();
            return { texture: texture, setAmount: setAmount };
        }
        function createWeatherController(_d) {
            var scene = _d.scene, renderer2 = _d.renderer, model2 = _d.model, sky2 = _d.sky, sun2 = _d.sun, hemisphere = _d.hemisphere, bounce = _d.bounce, atmosphere2 = _d.atmosphere, puddles = _d.puddles, rain = _d.rain, bloom = _d.bloom, clearEnvironment = _d.clearEnvironment, rainEnvironment = _d.rainEnvironment, rail2 = _d.rail, lightPaint2 = _d.lightPaint, screenLighting = _d.screenLighting, softShadows = _d.softShadows;
            var asphalt = model2.getObjectByName("Street asphalt").material;
            var lamps2 = [];
            scene.traverse(function (object) {
                if (object.isPointLight)
                    lamps2.push({ light: object, intensity: object.intensity });
            });
            var button = document.querySelector("#weather");
            var stage = document.querySelector("#stage");
            var icon = document.querySelector("#weather-icon");
            var label = document.querySelector("#weather-text");
            var dryRoad = new THREE.Color("#ffffff"), wetRoad = new THREE.Color("#cad6df");
            var pair = function (key) { return LOOK[key].map(function (hex) { return new THREE.Color(hex); }); };
            var sunColors = pair("sunColor"), skyFills = pair("skyFill"), groundFills = pair("groundFill"), fogColors = pair("fogColor");
            var mix = function (key, value) { return THREE.MathUtils.lerp(LOOK[key][0], LOOK[key][1], value); };
            var amount = 0, target = 0, from = 0, started = 0, lastApplied = -1;
            stage.dataset.weather = "clear";
            stage.dataset.transitioning = "false";
            function apply(value) {
                var e_394, _d;
                sky2.setAmount(value);
                sun2.color.lerpColors(sunColors[0], sunColors[1], value);
                sun2.intensity = mix("sunIntensity", value);
                sun2.shadow.radius = mix("sunSoftness", value) * (softShadows ? 1 : 3.2);
                hemisphere.color.lerpColors(skyFills[0], skyFills[1], value);
                hemisphere.groundColor.lerpColors(groundFills[0], groundFills[1], value);
                hemisphere.intensity = mix("fillIntensity", value);
                bounce.intensity = mix("bounce", value);
                scene.fog.color.lerpColors(fogColors[0], fogColors[1], value);
                scene.fog.density = mix("fogDensity", value);
                if (clearEnvironment) {
                    scene.environment = value < 0.5 ? clearEnvironment : rainEnvironment();
                    scene.environmentIntensity = mix("environment", value);
                }
                renderer2.toneMappingExposure = mix("exposure", value);
                atmosphere2.setRain(value);
                rail2.setRain(value);
                lightPaint2.setRain(value);
                asphalt.roughness = mix("asphaltRoughness", value);
                asphalt.clearcoat = mix("asphaltClearcoat", value);
                asphalt.clearcoatRoughness = mix("asphaltCoatRoughness", value);
                asphalt.color.lerpColors(dryRoad, wetRoad, value);
                var practical = mix("practicals", value);
                try {
                    for (var lamps2_1 = __values(lamps2), lamps2_1_1 = lamps2_1.next(); !lamps2_1_1.done; lamps2_1_1 = lamps2_1.next()) {
                        var _e = lamps2_1_1.value, light = _e.light, intensity = _e.intensity;
                        light.intensity = intensity * practical;
                    }
                }
                catch (e_394_1) { e_394 = { error: e_394_1 }; }
                finally {
                    try {
                        if (lamps2_1_1 && !lamps2_1_1.done && (_d = lamps2_1.return)) _d.call(lamps2_1);
                    }
                    finally { if (e_394) throw e_394.error; }
                }
                if (puddles)
                    puddles.material.uniforms.rainAmount.value = value;
                if (bloom) {
                    bloom.strength = mix("bloomStrength", value);
                    bloom.threshold = mix("bloomThreshold", value);
                }
                if (screenLighting) {
                    var settings = screenLighting.settings;
                    settings.occlusion = mix("occlusion", value);
                    settings.sunAir = mix("sunShafts", value);
                    settings.lampAir = mix("lampHalos", value);
                    screenLighting.pass.invalidate();
                }
                lastApplied = value;
            }
            function setRain(enabled, instant) {
                if (instant === void 0) { instant = false; }
                from = amount;
                target = enabled ? 1 : 0;
                started = performance.now();
                if (instant)
                    amount = target;
                stage.dataset.weather = enabled ? "rain" : "clear";
                button.setAttribute("aria-pressed", String(enabled));
                button.title = enabled ? "\u5207\u6362\u4E3A\u6674\u66AE" : "\u5207\u6362\u4E3A\u96E8\u5929";
                label.textContent = enabled ? "\u96E8\u5929" : "\u6674\u66AE";
                icon.setAttribute("d", enabled ? "M6 15a4 4 0 0 1-.4-8 6 6 0 0 1 11.6 1A3.5 3.5 0 0 1 18 15M8 18l-1 3m6-3-1 3m6-3-1 3" : "M3 17h18M6 21h12m-11-4a5 5 0 0 1 10 0M12 3v3M4 8l2 2m14-2-2 2M2 13h3m14 0h3");
            }
            apply(0);
            return {
                get amount() {
                    return amount;
                },
                get target() {
                    return target;
                },
                get transitioning() {
                    return Math.abs(amount - target) > 1e-5;
                },
                setRain: setRain,
                update: function (now, seconds) {
                    if (amount !== target) {
                        var phase = THREE.MathUtils.clamp((now - started) / 1500, 0, 1);
                        amount = phase === 1 ? target : THREE.MathUtils.lerp(from, target, phase * phase * (3 - 2 * phase));
                    }
                    if (amount !== lastApplied)
                        apply(amount);
                    stage.dataset.transitioning = String(amount !== target);
                    rain.update(seconds, amount);
                    if (puddles)
                        puddles.material.uniforms.rainTime.value = seconds;
                }
            };
        }
        var model = new THREE.Group();
        model.name = "\u5915\u51EA\u306E\u8857\u89D2";
        buildGround(model, false);
        buildStreetApproaches(model, model.getObjectByName("Street asphalt").material);
        buildContactShadows(model);
        buildStreetFurniture(model, false);
        buildGreenery(model);
        var lightPaint = createBuildingLightPaint();
        buildCafe(model, lightPaint);
        buildFlorist(model, lightPaint);
        var convenience = buildConvenience(model, lightPaint);
        buildParking(model);
        buildApartments(model, lightPaint);
        buildKiosk(model, lightPaint);
        buildStreetLife(model);
        buildPocketGarden(model);
        var shops = buildShops(model, lightPaint);
        buildSurroundings(model);
        lightPaint.mount(model);
        model.updateMatrixWorld(true);
        var kiosk = model.getObjectByName("\u5915\u51EA\u65B0\u805E\u5E97"), ki = kiosk.matrixWorld.clone().invert(), clearance = new THREE.Box3(), clearMatrix = new THREE.Matrix4(), relocate = [];
        kiosk.traverse(function (o) {
            if (!o.isMesh)
                return;
            if (!o.geometry.boundingBox)
                o.geometry.computeBoundingBox();
            clearMatrix.multiplyMatrices(ki, o.matrixWorld);
            clearance.copy(o.geometry.boundingBox).applyMatrix4(clearMatrix);
            if (clearance.min.y > 0.129 && clearance.min.y < 2 && clearance.min.z < -0.5 && clearance.max.x > -0.55 && clearance.min.x < 0.55)
                relocate.push(o);
        });
        relocate.forEach(function (o) { return o.removeFromParent(); });
        var obstacles = [], box = new THREE.Box3(), matrix = new THREE.Matrix4(), one = new THREE.Matrix4();
        function capture(mesh, m) {
            if (!mesh.geometry.boundingBox)
                mesh.geometry.computeBoundingBox();
            if (!mesh.geometry.boundingBox)
                return;
            box.copy(mesh.geometry.boundingBox).applyMatrix4(m);
            var size = box.getSize(new THREE.Vector3());
            if (box.max.y < 0.05 || box.min.y > 2.8 || size.x * size.z > 120 || size.y < 0.12 && size.x * size.z < 0.9 || size.x < 0.035 || size.z < 0.035)
                return;
            if (mesh.material.userData && mesh.material.userData.distantNeighborhood || mesh.material.transparent && mesh.material.opacity < 0.21)
                return;
            obstacles.push({ x: (box.min.x + box.max.x) / 2, y: (box.min.y + box.max.y) / 2, z: (box.min.z + box.max.z) / 2, w: size.x, h: size.y, d: size.z });
        }
        model.traverse(function (mesh) {
            if (!mesh.isMesh || mesh.material.isShaderMaterial || mesh.material.depthWrite === false)
                return;
            if (mesh.isInstancedMesh) {
                for (var i = 0; i < mesh.count; i++) {
                    mesh.getMatrixAt(i, one);
                    matrix.multiplyMatrices(mesh.matrixWorld, one);
                    capture(mesh, matrix);
                }
            }
            else
                capture(mesh, mesh.matrixWorld);
        });
        batchStaticParts(model);
        var rail = buildRail(model);
        var petals = buildPetals(model);
        var lamps = [];
        model.traverse(function (o) {
            if (o.isPointLight) {
                o.castShadow = false;
                lamps.push(o);
            }
            if (o.isMesh)
                o.userData.colExempt = true;
        });
        lamps.forEach(function (o, i) { return o.visible = i < 4; });
        var hemi = new THREE.HemisphereLight(LOOK.skyFill[0], LOOK.groundFill[0], LOOK.fillIntensity[0]);
        model.add(hemi);
        var sun = new THREE.DirectionalLight(LOOK.sunColor[0], LOOK.sunIntensity[0]);
        sun.position.copy(EVENING_SUN);
        sun.target.position.set(0, 0, -0.6);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1536, 1536);
        Object.assign(sun.shadow.camera, { left: -35, right: 35, top: 35, bottom: -35, near: 0.5, far: 110 });
        sun.shadow.bias = -3e-4;
        sun.shadow.normalBias = 0.03;
        model.add(sun, sun.target);
        var fill = new THREE.DirectionalLight("#b7c7e3", LOOK.bounce[0]);
        fill.position.set(15, 12, 18);
        model.add(fill);
        var sky = createWeatherSky().texture;
        model.background = sky;
        var environment = makeEveningEnvironment(renderer);
        var atmosphere = applyAtmosphericFalloff(model, renderer, rail.headlightX, null, null);
        var train = model.getObjectByName("600\u5F62 tram");
        var elapsed = 0;
        return { model: model, obstacles: obstacles, sun: sun, sky: sky, environment: environment, atmosphere: atmosphere, train: train, init: function () {
                model.updateWorldMatrix(true, true);
                atmosphere.setWorldMatrix(model.matrixWorld);
                var done = new Set();
                model.traverse(function (o) {
                    var e_395, _d, e_396, _e;
                    if (!o.isMesh)
                        return;
                    try {
                        for (var _f = __values(Array.isArray(o.material) ? o.material : [o.material]), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var m = _g.value;
                            if (!m.clippingPlanes)
                                continue;
                            try {
                                for (var _h = (e_396 = void 0, __values(m.clippingPlanes)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                    var plane = _j.value;
                                    if (done.has(plane))
                                        continue;
                                    done.add(plane);
                                    plane.applyMatrix4(model.matrixWorld);
                                }
                            }
                            catch (e_396_1) { e_396 = { error: e_396_1 }; }
                            finally {
                                try {
                                    if (_j && !_j.done && (_e = _h.return)) _e.call(_h);
                                }
                                finally { if (e_396) throw e_396.error; }
                            }
                        }
                    }
                    catch (e_395_1) { e_395 = { error: e_395_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                        }
                        finally { if (e_395) throw e_395.error; }
                    }
                });
            }, update: function (dt, hero) {
                elapsed += Math.min(dt, 0.15);
                var listener = hero ? model.worldToLocal(hero.clone()) : new THREE.Vector3();
                var point = new THREE.Vector3();
                lamps.sort(function (a, b) {
                    a.getWorldPosition(point);
                    var da = model.worldToLocal(point).distanceToSquared(listener);
                    b.getWorldPosition(point);
                    return da - model.worldToLocal(point).distanceToSquared(listener);
                });
                lamps.forEach(function (o, i) { return o.visible = i < 4; });
                atmosphere.resize();
                rail.update(elapsed);
                shops(elapsed);
                convenience(elapsed);
                petals(elapsed, 1);
            }, ground: function (x, z) {
                if (x < -14 || x > 14 || z < -17.1 || z > 15.9)
                    return -100;
                return x > -0.42 && x < 4.86 ? roadHeight(x) : 0.176;
            } };
    }
    return __toCommonJS(yunagi_adapter_exports);
})();
